# Health Data Collector (minimal test build)

**Goal:** Use the previously confirmed Android Health Connect integration to collect Samsung Health / OMRON data and save a private `health-review.json` file for ChatGPT to read from the user's own connected Google Drive.

## One-time setup (on the Samsung phone)
1. Install the debug APK named `Health Collector`. It is a separate app from the original `Health Buddy Test`.
2. Open it and tap **ALLOW HEALTH ACCESS**. Approve only the Health Connect categories you want: steps, sleep, heart rate, weight, blood pressure; optional separate permission for background readings if available.
3. Tap **CHOOSE DRIVE FILE**. In the Android **system document picker**, explicitly choose a private folder in **Google Drive**, not Downloads or local storage. Create the suggested `health-review.json`.
4. Tap **SYNC NOW**. Confirm that the on-screen result says SUCCESS, then independently verify that `health-review.json` actually appears in your connected Google Drive and can be read by ChatGPT.
5. If the phone supports background Health Connect access *and* you granted it, the app schedules an approximately 12-hour WorkManager task. Android may defer execution; Drive may defer uploading. Manual **SYNC NOW** always remains available.

## Security and limitations
- No network SDK, external analytics, developer server, or GitHub data uploads. The output is created via Android's built-in **Storage Access Framework** at a user-selected document URI. The chosen document contains unencrypted health measurements **inside your private Drive**—do not share its link or folder publicly.
- The app only requests read access to Health Connect. Revoking Android Health Connect or document permissions stops future exports.
- A Drive document is not proof that ChatGPT can see the data until connector lookup succeeds and the sync timestamps match. Cloud visibility requires a real-device end-to-end test.
- Missing data (especially RENPHO weight, OMRON blood pressure) may mean upstream syncing is missing. The app records `unavailable_or_errors` separately from empty record arrays; it never substitutes zero.
- Steps are daily aggregates (seven calendar days); sleep and heart-rate records span seven rolling days; weight and blood pressure span 30 rolling days. Original timestamps, source package names and record IDs are included.
- All data in this project repository is code. Never commit the generated health JSON.
- This is a **beta test**, not a medical device, a diagnosis, or guaranteed continuous monitoring. No notifications for urgent conditions.
