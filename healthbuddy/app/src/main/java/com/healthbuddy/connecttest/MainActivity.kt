package com.healthbuddy.connecttest

import android.content.Intent
import android.os.Bundle
import android.graphics.Typeface
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import androidx.activity.ComponentActivity
import androidx.activity.result.contract.ActivityResultContracts
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.PermissionController
import androidx.health.connect.client.HealthConnectFeatures
import androidx.health.connect.client.permission.HealthPermission
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import java.util.concurrent.TimeUnit

/**
 * Minimal private collector. Health data never goes to GitHub, a custom server,
 * or an account we control. User selects the destination with Android's picker.
 */
class MainActivity : ComponentActivity() {
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main)
    private lateinit var status: TextView
    private lateinit var syncButton: Button

    private val permissionLauncher = registerForActivityResult(
        PermissionController.createRequestPermissionResultContract()
    ) { refreshStatus() }

    private val documentLauncher = registerForActivityResult(
        ActivityResultContracts.CreateDocument("application/json")
    ) { uri ->
        if (uri == null) {
            status.text = "No document selected. Nothing uploaded."
        } else {
            try {
                contentResolver.takePersistableUriPermission(
                    uri, Intent.FLAG_GRANT_WRITE_URI_PERMISSION
                )
                HealthExport.setDocument(this, uri)
                status.text = "Document selected. Syncing your authorized records…"
                enableBackgroundIfPermitted()
                syncNow()
            } catch (e: Exception) {
                status.text = "Cannot keep write access to that document: ${e.message}"
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val layout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(34, 50, 34, 34)
        }
        val title = TextView(this).apply {
            text = "Health Data Collector"
            textSize = 23f
            setTypeface(null, Typeface.BOLD)
        }
        val note = TextView(this).apply {
            text = "A tiny data bridge for your health reviews.\n\n" +
                "1. Allow Health Connect access including new body-composition fields.\n" +
                "2. If a Drive file is already chosen, KEEP it. Otherwise create a private file.\n" +
                "3. Tap Sync Now to test it.\n\n" +
                "The file contains your actual measurements, so DO NOT make it public. " +
                "Auto-refresh every ~12 hours is attempted only when Android permits " +
                "background Health Connect reads. You control permissions and the file."
            textSize = 16f
        }
        val permissionButton = Button(this).apply {
            text = "1 · ALLOW HEALTH ACCESS / NEW BODY DATA"
            setOnClickListener { grantAccess() }
        }
        val fileButton = Button(this).apply {
            text = "2 · CHOOSE DRIVE FILE"
            setOnClickListener { documentLauncher.launch("health-review.json") }
        }
        syncButton = Button(this).apply {
            text = "3 · SYNC NOW"
            setOnClickListener { syncNow() }
        }
        status = TextView(this).apply {
            textSize = 15f
            setTextIsSelectable(true)
        }
        listOf(title, note, permissionButton, fileButton, syncButton, status)
            .forEach(layout::addView)
        setContentView(ScrollView(this).apply { addView(layout) })
        refreshStatus()
    }

    private fun refreshStatus() {
        val last = getSharedPreferences("health_export", MODE_PRIVATE)
            .getString("last_sync", null)
        val selected = HealthExport.savedDocument(this) != null
        status.text = "Drive file: ${if (selected) "chosen" else "not chosen"}\n" +
            "Last successful save: ${last ?: "never"}\n" +
            "New body measurements need a one-time permission approval after the update. " +
            "Tap ALLOW HEALTH ACCESS, then SYNC NOW; keep your existing Drive file. " +
            "The selected file contains private health information."
        if (selected) enableBackgroundIfPermitted()
    }

    private fun grantAccess() {
        if (HealthConnectClient.getSdkStatus(this) != HealthConnectClient.SDK_AVAILABLE) {
            status.text = "Health Connect isn't available on this phone."
            return
        }
        scope.launch {
            try {
                val client = HealthConnectClient.getOrCreate(this@MainActivity)
                val requested = HealthExport.dataPermissions().toMutableSet()
                val backgroundAvailable = client.features.getFeatureStatus(
                    HealthConnectFeatures.FEATURE_READ_HEALTH_DATA_IN_BACKGROUND
                ) == HealthConnectFeatures.FEATURE_STATUS_AVAILABLE
                if (backgroundAvailable) {
                    requested.add(HealthPermission.PERMISSION_READ_HEALTH_DATA_IN_BACKGROUND)
                }
                val granted = client.permissionController.getGrantedPermissions()
                if (requested.all { it in granted }) {
                    refreshStatus()
                    status.append("\nPermissions already granted.")
                } else {
                    permissionLauncher.launch(requested - granted)
                }
            } catch (e: Exception) {
                status.text = "Permission request failed: ${e.message}"
            }
        }
    }

    private fun enableBackgroundIfPermitted() {
        scope.launch {
            try {
                val client = HealthConnectClient.getOrCreate(this@MainActivity)
                val supported = client.features.getFeatureStatus(
                    HealthConnectFeatures.FEATURE_READ_HEALTH_DATA_IN_BACKGROUND
                ) == HealthConnectFeatures.FEATURE_STATUS_AVAILABLE
                val granted = client.permissionController.getGrantedPermissions()
                if (!supported ||
                    HealthPermission.PERMISSION_READ_HEALTH_DATA_IN_BACKGROUND !in granted
                ) {
                    status.append("\nBackground access not available/granted; use Sync Now.")
                    return@launch
                }
                val request =
                    PeriodicWorkRequestBuilder<HealthSyncWorker>(12, TimeUnit.HOURS).build()
                WorkManager.getInstance(this@MainActivity).enqueueUniquePeriodicWork(
                    "health-drive-update",
                    ExistingPeriodicWorkPolicy.KEEP,
                    request
                )
                status.append("\nBackground refresh requested (timing not guaranteed).")
            } catch (e: Exception) {
                status.append("\nCould not schedule background work: ${e.message}")
            }
        }
    }

    private fun syncNow() {
        if (HealthExport.savedDocument(this) == null) {
            status.text = "Choose a file in your private Google Drive first."
            return
        }
        syncButton.isEnabled = false
        status.text = "Reading Health Connect and writing the selected document…"
        scope.launch {
            try {
                val result = HealthExport.save(this@MainActivity)
                status.text = "SUCCESS — ${result}\n\n" +
                    "Next, verify health-review.json appears in Google Drive. " +
                    "Then ask ChatGPT to read it. This app has not yet verified Drive upload."
            } catch (e: Exception) {
                status.text = "SYNC FAILED — ${e.javaClass.simpleName}: ${e.message}"
            } finally {
                syncButton.isEnabled = true
            }
        }
    }

    override fun onDestroy() {
        scope.cancel()
        super.onDestroy()
    }
}
