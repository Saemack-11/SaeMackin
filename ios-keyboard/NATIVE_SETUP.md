# SHIN Keyboard native packaging

## Targets
Create an iOS App target named **SHIN** and a **Custom Keyboard Extension** target named **SHINKeyboard**.

Suggested bundle IDs:
- Host: `com.saeway.shin`
- Keyboard: `com.saeway.shin.keyboard`

If either identifier is unavailable in the Apple Developer account, replace both with identifiers owned by the account.

## Files
Host target:
- `SHINHostApp.swift`
- `SHINHost.entitlements`
- `SharedConfig.swift`

Keyboard target:
- `KeyboardViewController.swift`
- `SHINKeyboard-Info.plist`
- `SHINKeyboard.entitlements`
- `SharedConfig.swift`

## Capabilities
Enable App Groups on both targets and use:
`group.com.saeway.shinkeyboard`

The keyboard Info.plist requests Open Access because SHIN calls the SaeMackin network API.

## Signing
Select the user's Apple Development team for both targets and let Xcode manage signing. Do not commit certificates, private keys, provisioning profiles, or Apple credentials.

## Device test
1. Build/run the SHIN host app on the iPhone.
2. Settings → General → Keyboard → Keyboards → Add New Keyboard → SHIN Keyboard.
3. Enable Allow Full Access.
4. Open Messages or Notes, switch to SHIN with the globe control, copy/paste a message, Generate, then tap a reply.
5. Verify the reply is inserted but not sent automatically.
6. Verify secure text fields fall back to the system keyboard.

## Release gate
Before TestFlight/App Store distribution, add a public privacy policy and App Store privacy disclosures that accurately describe message text sent to the SaeMackin API for generation.
