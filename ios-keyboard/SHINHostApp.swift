import SwiftUI

@main
struct SHINHostApp: App {
    var body: some Scene {
        WindowGroup { OnboardingView() }
    }
}

struct OnboardingView: View {
    private let studioURL = URL(string: "https://saemackin101.vercel.app")!

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    Text("SHIN Keyboard").font(.largeTitle.bold())
                    Text("SaeMackin101 everywhere you type.")
                        .font(.title3).foregroundStyle(.secondary)

                    instruction("1", "Add SHIN Keyboard", "Open Settings → General → Keyboard → Keyboards → Add New Keyboard, then choose SHIN Keyboard.")
                    instruction("2", "Allow Full Access", "SHIN needs network access to reach the SaeMackin reply engine. Clipboard text is only sent after you choose Paste/Generate.")
                    instruction("3", "Use it", "Copy an incoming message, switch keyboards with the globe key, paste it into SHIN, choose a mode, generate, then tap a reply to insert it.")
                    instruction("4", "You stay in control", "SHIN inserts text only. It never presses Send for you.")

                    Link("Open SaeMackin Studio", destination: studioURL)
                        .buttonStyle(.borderedProminent)

                    Text("Some secure fields, phone-number fields, and apps that block third-party keyboards will use Apple's system keyboard instead.")
                        .font(.footnote).foregroundStyle(.secondary)
                }.padding()
            }.navigationTitle("Setup")
        }
    }

    private func instruction(_ number: String, _ title: String, _ detail: String) -> some View {
        HStack(alignment: .top, spacing: 12) {
            Text(number).font(.headline).frame(width: 30, height: 30)
                .background(.thinMaterial, in: Circle())
            VStack(alignment: .leading, spacing: 4) {
                Text(title).font(.headline)
                Text(detail).foregroundStyle(.secondary)
            }
        }
    }
}