# Generate the SHIN Xcode project

The repo includes `project.yml` so the native project can be generated consistently with XcodeGen instead of committing a fragile hand-edited `.xcodeproj`.

## Mac build workstation

1. Install current Xcode.
2. Install XcodeGen.
3. From the repository root run:
   `xcodegen generate --spec ios-keyboard/project.yml`
4. Open `SHIN.xcodeproj`.
5. In Signing & Capabilities, select the Apple Development team for **SHIN** and **SHINKeyboard**.
6. Confirm both targets have the App Group `group.com.saeway.shinkeyboard`.
7. Connect the iPhone, choose it as the run destination, and run **SHIN**.

No Apple ID, certificate, provisioning profile, private key, or team identifier belongs in GitHub.

## First device smoke test

After installation:
- Launch SHIN and read onboarding.
- Add SHIN Keyboard in iOS keyboard settings.
- Enable Allow Full Access.
- Open Notes or Messages.
- Copy a sample incoming message.
- Switch to SHIN Keyboard.
- Paste → choose mode → Generate.
- Tap a generated reply and confirm it inserts into the field.
- Confirm SHIN does not send it automatically.
