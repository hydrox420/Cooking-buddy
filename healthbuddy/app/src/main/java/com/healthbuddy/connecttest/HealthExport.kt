package com.healthbuddy.connecttest

import android.content.Context
import android.net.Uri
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.BloodPressureRecord
import androidx.health.connect.client.records.HeartRateRecord
import androidx.health.connect.client.records.Record
import androidx.health.connect.client.records.SleepSessionRecord
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.records.WeightRecord
import androidx.health.connect.client.request.AggregateRequest
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.time.Duration
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import java.time.temporal.ChronoUnit
import kotlin.reflect.KClass

/**
 * Read-only Health Connect snapshot. Exports ONLY to the document the owner selected
 * in Android's system document picker; it contains no network client or credentials.
 *
 * An empty collection is NOT interpreted as a medical zero. Every record keeps its
 * original timestamp and data origin so downstream analysis can detect duplicates.
 */
object HealthExport {
    private const val PREFS = "health_export"
    private const val URI_KEY = "drive_document_uri"
    private val permissions = mapOf(
        "steps" to HealthPermission.getReadPermission(StepsRecord::class),
        "sleep" to HealthPermission.getReadPermission(SleepSessionRecord::class),
        "heart_rate" to HealthPermission.getReadPermission(HeartRateRecord::class),
        "weight" to HealthPermission.getReadPermission(WeightRecord::class),
        "blood_pressure" to HealthPermission.getReadPermission(BloodPressureRecord::class)
    )

    fun dataPermissions(): Set<String> = permissions.values.toSet()
    fun savedDocument(context: Context): Uri? =
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .getString(URI_KEY, null)?.let(Uri::parse)

    fun setDocument(context: Context, uri: Uri) {
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .edit().putString(URI_KEY, uri.toString()).apply()
    }

    private suspend fun <T : Record> readAll(
        client: HealthConnectClient,
        recordType: KClass<T>,
        range: TimeRangeFilter
    ): List<T> {
        val result = mutableListOf<T>()
        var next: String? = null
        do {
            val page = client.readRecords(
                ReadRecordsRequest(
                    recordType = recordType,
                    timeRangeFilter = range,
                    pageSize = 250,
                    pageToken = next
                )
            )
            result.addAll(page.records)
            next = page.pageToken
        } while (next != null)
        return result
    }

    suspend fun save(context: Context): String = withContext(Dispatchers.IO) {
        val uri = savedDocument(context)
            ?: throw IllegalStateException("Choose a Google Drive document first.")
        if (HealthConnectClient.getSdkStatus(context) != HealthConnectClient.SDK_AVAILABLE) {
            throw IllegalStateException("Health Connect isn't available.")
        }
        val client = HealthConnectClient.getOrCreate(context)
        val granted = client.permissionController.getGrantedPermissions()
        val now = Instant.now()
        val week = TimeRangeFilter.between(now.minus(7, ChronoUnit.DAYS), now)
        val month = TimeRangeFilter.between(now.minus(30, ChronoUnit.DAYS), now)
        val root = JSONObject()
        val data = JSONObject()
        val errors = JSONObject()
        val counts = JSONObject()
        root.put("schema_version", 1)
        root.put("generated_at_utc", now.toString())
        root.put("timezone", ZoneId.systemDefault().id)
        root.put("source", "Android Health Connect, user-authorized read-only")
        root.put("windows", JSONObject().put("steps_days", 7)
            .put("sleep_days", 7).put("heart_rate_days", 7)
            .put("weight_days", 30).put("blood_pressure_days", 30))

        suspend fun collect(key: String, block: suspend () -> JSONArray) {
            if (permissions[key] !in granted) {
                errors.put(key, "Permission not granted")
                return
            }
            try {
                val values = block()
                data.put(key, values)
                counts.put(key, values.length())
            } catch (e: Exception) {
                errors.put(key, "${e.javaClass.simpleName}: ${e.message ?: "Read failed"}")
            }
        }

        collect("steps") {
            val arr = JSONArray()
            val zone = ZoneId.systemDefault()
            val today = LocalDate.now(zone)
            for (offset in 6 downTo 0) {
                val date = today.minusDays(offset.toLong())
                val start = date.atStartOfDay(zone).toInstant()
                val end = date.plusDays(1).atStartOfDay(zone).toInstant()
                val count = client.aggregate(
                    AggregateRequest(setOf(StepsRecord.COUNT_TOTAL), TimeRangeFilter.between(start, end))
                )[StepsRecord.COUNT_TOTAL]
                arr.put(JSONObject().put("date", date.toString())
                    .put("steps", count ?: JSONObject.NULL))
            }
            arr
        }

        collect("sleep") {
            JSONArray().apply {
                readAll(client, SleepSessionRecord::class, week).forEach { record ->
                    put(JSONObject()
                        .put("id", record.metadata.id)
                        .put("started_at_utc", record.startTime.toString())
                        .put("ended_at_utc", record.endTime.toString())
                        .put("duration_minutes", Duration.between(record.startTime, record.endTime).toMinutes())
                        .put("data_origin", record.metadata.dataOrigin.packageName))
                }
            }
        }

        collect("heart_rate") {
            JSONArray().apply {
                readAll(client, HeartRateRecord::class, week).forEach { record ->
                    val samples = JSONArray()
                    record.samples.forEach { sample ->
                        samples.put(JSONObject()
                            .put("time_utc", sample.time.toString())
                            .put("bpm", sample.beatsPerMinute))
                    }
                    put(JSONObject()
                        .put("id", record.metadata.id)
                        .put("started_at_utc", record.startTime.toString())
                        .put("ended_at_utc", record.endTime.toString())
                        .put("data_origin", record.metadata.dataOrigin.packageName)
                        .put("samples", samples))
                }
            }
        }

        collect("weight") {
            JSONArray().apply {
                readAll(client, WeightRecord::class, month).forEach { record ->
                    put(JSONObject()
                        .put("id", record.metadata.id)
                        .put("time_utc", record.time.toString())
                        .put("kilograms", record.weight.inKilograms)
                        .put("data_origin", record.metadata.dataOrigin.packageName))
                }
            }
        }

        collect("blood_pressure") {
            JSONArray().apply {
                readAll(client, BloodPressureRecord::class, month).forEach { record ->
                    put(JSONObject()
                        .put("id", record.metadata.id)
                        .put("time_utc", record.time.toString())
                        .put("systolic_mmhg", record.systolic.inMillimetersOfMercury)
                        .put("diastolic_mmhg", record.diastolic.inMillimetersOfMercury)
                        .put("data_origin", record.metadata.dataOrigin.packageName))
                }
            }
        }

        root.put("data", data)
        root.put("record_counts", counts)
        root.put("unavailable_or_errors", errors)
        // Provider-managed document writes are atomic only if that provider supports them.
        val stream = context.contentResolver.openOutputStream(uri, "wt")
            ?: throw IllegalStateException("Can't open selected document for writing.")
        stream.use { it.write(root.toString(2).toByteArray(Charsets.UTF_8)) }
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .edit().putString("last_sync", now.toString()).apply()
        "Saved ${counts.optInt("sleep")} sleep, ${counts.optInt("heart_rate")} heart-rate, " +
            "${counts.optInt("blood_pressure")} blood-pressure, and " +
            "${counts.optInt("weight")} weight records; " +
            "${errors.length()} unavailable/error categories. Updated ${now}."
    }
}
