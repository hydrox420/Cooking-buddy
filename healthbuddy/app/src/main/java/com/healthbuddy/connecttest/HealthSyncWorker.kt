package com.healthbuddy.connecttest

import android.content.Context
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.permission.HealthPermission
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters

/**
 * Best-effort periodic refresh. The OS and cloud document provider determine
 * when an update runs and when Google Drive finishes its own upload.
 */
class HealthSyncWorker(context: Context, params: WorkerParameters) :
    CoroutineWorker(context, params) {
    override suspend fun doWork(): Result {
        if (HealthExport.savedDocument(applicationContext) == null) return Result.success()
        return try {
            if (HealthConnectClient.getSdkStatus(applicationContext) !=
                HealthConnectClient.SDK_AVAILABLE
            ) return Result.success()
            val client = HealthConnectClient.getOrCreate(applicationContext)
            val granted = client.permissionController.getGrantedPermissions()
            if (HealthPermission.PERMISSION_READ_HEALTH_DATA_IN_BACKGROUND !in granted) {
                return Result.success()
            }
            HealthExport.save(applicationContext)
            Result.success()
        } catch (_: SecurityException) {
            // Permission revoked: never retry aggressively.
            Result.success()
        } catch (_: Exception) {
            Result.retry()
        }
    }
}
