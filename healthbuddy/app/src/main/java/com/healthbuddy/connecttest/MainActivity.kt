package com.healthbuddy.connecttest

import android.app.Activity
import android.os.Bundle
import android.graphics.Typeface
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import androidx.activity.result.contract.ActivityResultContracts
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.PermissionController
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.HeartRateRecord
import androidx.health.connect.client.records.SleepSessionRecord
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.records.WeightRecord
import androidx.health.connect.client.request.AggregateRequest
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.Locale

class MainActivity : Activity() {
 private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main)
 private lateinit var resultView: TextView
 private lateinit var testButton: Button
 private val requiredPermissions = setOf(
  HealthPermission.getReadPermission(StepsRecord::class),
  HealthPermission.getReadPermission(SleepSessionRecord::class),
  HealthPermission.getReadPermission(HeartRateRecord::class),
  HealthPermission.getReadPermission(WeightRecord::class)
 )
 private val permissionsLauncher = registerForActivityResult(
  PermissionController.createRequestPermissionResultContract()
 ) {
  if (it.isEmpty()) resultView.text = "No permissions granted; test not run."
  else readRecords()
 }

 override fun onCreate(savedInstanceState: Bundle?) {
  super.onCreate(savedInstanceState)
  val layout = LinearLayout(this).apply {
   orientation = LinearLayout.VERTICAL
   setPadding(35,60,35,35)
  }
  val title = TextView(this).apply {
   text = "Health Buddy — Connection Test"
   textSize = 22f
   setTypeface(null, Typeface.BOLD)
  }
  val note = TextView(this).apply {
   text = "One test: permission → read actual Health Connect records. Last 7 days of steps, sleep, and heart rate; last 30 days of weight. Read only. No upload or internet access."
   textSize = 16f
  }
  testButton = Button(this).apply {
   text = "TEST CONNECTION"
   setOnClickListener { startTest() }
  }
  resultView = TextView(this).apply {
   text = "Ready. Tap TEST CONNECTION."
   textSize = 16f
   setTextIsSelectable(true)
  }
  layout.addView(title)
  layout.addView(note)
  layout.addView(testButton)
  layout.addView(resultView)
  setContentView(ScrollView(this).apply { addView(layout) })
 }

 private fun startTest() {
  val status = HealthConnectClient.getSdkStatus(this)
  if (status != HealthConnectClient.SDK_AVAILABLE) {
   resultView.text = "FAIL — Health Connect unavailable (status " + status + ")."
   return
  }
  scope.launch {
   try {
    val client = HealthConnectClient.getOrCreate(this@MainActivity)
    val granted = client.permissionController.getGrantedPermissions()
    if (!granted.containsAll(requiredPermissions)) {
     resultView.text = "Waiting for Health Connect read permissions…"
     permissionsLauncher.launch(requiredPermissions - granted)
    } else readRecords()
   } catch (ex: Exception) {
    resultView.text = "FAIL — permission access: " + ex.javaClass.simpleName + ": " + ex.message
   }
  }
 }

 private fun readRecords() {
  testButton.isEnabled = false
  resultView.text = "Reading Health Connect…"
  scope.launch {
   val output = try {
    withContext(Dispatchers.IO) {
     val client = HealthConnectClient.getOrCreate(this@MainActivity)
     val granted = client.permissionController.getGrantedPermissions()
     val now = Instant.now()
     val week = TimeRangeFilter.between(now.minus(7, ChronoUnit.DAYS),now)
     val month = TimeRangeFilter.between(now.minus(30, ChronoUnit.DAYS),now)
     val sb = StringBuilder("HEALTH CONNECT TEST\n\n")
     sb.append("Permissions: ").append(granted.intersect(requiredPermissions).size).append("/4 granted\n\n")
     suspend fun check(name:String, permission:String, work:suspend ()->String) {
      sb.append(name).append("\n")
      if (permission !in granted) sb.append("NOT AUTHORIZED")
      else try { sb.append(work()) } catch(e:Exception) {
       sb.append("ERROR: ").append(e.javaClass.simpleName).append(" — ").append(e.message)
      }
      sb.append("\n\n")
     }
     check("STEPS (7 days)",HealthPermission.getReadPermission(StepsRecord::class)) {
      val total=client.aggregate(AggregateRequest(setOf(StepsRecord.COUNT_TOTAL),week))[StepsRecord.COUNT_TOTAL]
      if(total==null) "No step records found" else "PASS: " + total + " steps"
     }
     check("SLEEP (7 days)",HealthPermission.getReadPermission(SleepSessionRecord::class)) {
      val records=client.readRecords(ReadRecordsRequest(SleepSessionRecord::class,week,pageSize=100)).records
      if(records.isEmpty()) "No sleep records found" else "PASS: " + records.size + " sessions; source: " + records[0].metadata.dataOrigin.packageName
     }
     check("HEART RATE (7 days)",HealthPermission.getReadPermission(HeartRateRecord::class)) {
      val records=client.readRecords(ReadRecordsRequest(HeartRateRecord::class,week,pageSize=100)).records
      if(records.isEmpty()) "No heart rate records found" else "PASS: " + records.size + " records in first page; source: " + records[0].metadata.dataOrigin.packageName
     }
     check("WEIGHT (30 days)",HealthPermission.getReadPermission(WeightRecord::class)) {
      val records=client.readRecords(ReadRecordsRequest(WeightRecord::class,month,pageSize=100)).records
      if(records.isEmpty()) "No weight records found" else "PASS: " + records.size + " records; source: " + records[0].metadata.dataOrigin.packageName
     }
     sb.append("No records = data unavailable, not necessarily broken permissions.\n")
     sb.toString()
    }
   } catch(e:Exception) { "TEST ERROR: " + e.javaClass.simpleName + ": " + e.message }
   resultView.text=output
   testButton.isEnabled=true
  }
 }
 override fun onDestroy() {
  scope.cancel()
  super.onDestroy()
 }
}
