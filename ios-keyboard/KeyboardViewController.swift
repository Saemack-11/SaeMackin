import UIKit

final class KeyboardViewController: UIInputViewController {
    private let stack = UIStackView()
    private let modeScroll = UIScrollView()
    private let modeStack = UIStackView()
    private let outputLabel = UILabel()
    private let alternatesStack = UIStackView()
    private let statusLabel = UILabel()

    private var selectedMode = "shin"
    private var pastedMessage = ""
    private var primaryReply = ""
    private var alternateReplies: [String: String] = [:]
    private var task: URLSessionDataTask?

    // Replace with the production SaeMackin deployment URL in the Xcode target.
    private let apiURL = URL(string: "https://YOUR-SAEMACKIN-DOMAIN/api/keyboard")!

    override func viewDidLoad() {
        super.viewDidLoad()
        configureUI()
    }

    deinit {
        task?.cancel()
    }

    private func configureUI() {
        view.backgroundColor = .systemBackground

        stack.axis = .vertical
        stack.spacing = 8
        stack.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(stack)

        let actions = UIStackView()
        actions.distribution = .fillEqually
        actions.spacing = 6
        actions.addArrangedSubview(button("🌐", action: #selector(nextKeyboard)))
        actions.addArrangedSubview(button("Paste", action: #selector(pasteMessage)))
        actions.addArrangedSubview(button("Generate", action: #selector(generateReply)))

        modeStack.axis = .horizontal
        modeStack.spacing = 6
        ["shin", "smooth", "sauce", "direct", "solid", "funny"].forEach { mode in
            let b = UIButton(type: .system)
            b.setTitle(mode.capitalized, for: .normal)
            b.accessibilityIdentifier = mode
            b.addTarget(self, action: #selector(selectMode(_:)), for: .touchUpInside)
            modeStack.addArrangedSubview(b)
        }
        modeStack.translatesAutoresizingMaskIntoConstraints = false
        modeScroll.showsHorizontalScrollIndicator = false
        modeScroll.addSubview(modeStack)

        outputLabel.numberOfLines = 4
        outputLabel.font = .systemFont(ofSize: 14)
        outputLabel.text = "Copy a message, tap Paste, choose a mode, then Generate."
        outputLabel.isUserInteractionEnabled = true
        outputLabel.addGestureRecognizer(UITapGestureRecognizer(target: self, action: #selector(insertPrimaryReply)))

        alternatesStack.axis = .horizontal
        alternatesStack.distribution = .fillEqually
        alternatesStack.spacing = 6
        ["smooth", "sauce", "direct"].forEach { key in
            let b = UIButton(type: .system)
            b.setTitle(key.capitalized, for: .normal)
            b.accessibilityIdentifier = key
            b.addTarget(self, action: #selector(insertAlternate(_:)), for: .touchUpInside)
            b.isHidden = true
            alternatesStack.addArrangedSubview(b)
        }

        statusLabel.font = .systemFont(ofSize: 11)
        statusLabel.textColor = .secondaryLabel
        statusLabel.numberOfLines = 2
        statusLabel.text = "SHIN only inserts text. You press Send."

        stack.addArrangedSubview(actions)
        stack.addArrangedSubview(modeScroll)
        stack.addArrangedSubview(outputLabel)
        stack.addArrangedSubview(alternatesStack)
        stack.addArrangedSubview(statusLabel)

        NSLayoutConstraint.activate([
            stack.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 8),
            stack.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -8),
            stack.topAnchor.constraint(equalTo: view.topAnchor, constant: 8),
            stack.bottomAnchor.constraint(lessThanOrEqualTo: view.bottomAnchor, constant: -8),
            modeStack.leadingAnchor.constraint(equalTo: modeScroll.contentLayoutGuide.leadingAnchor),
            modeStack.trailingAnchor.constraint(equalTo: modeScroll.contentLayoutGuide.trailingAnchor),
            modeStack.topAnchor.constraint(equalTo: modeScroll.contentLayoutGuide.topAnchor),
            modeStack.bottomAnchor.constraint(equalTo: modeScroll.contentLayoutGuide.bottomAnchor),
            modeStack.heightAnchor.constraint(equalTo: modeScroll.frameLayoutGuide.heightAnchor),
            modeScroll.heightAnchor.constraint(equalToConstant: 34)
        ])
    }

    private func button(_ title: String, action: Selector) -> UIButton {
        let button = UIButton(type: .system)
        button.setTitle(title, for: .normal)
        button.addTarget(self, action: action, for: .touchUpInside)
        return button
    }

    @objc private func nextKeyboard() {
        advanceToNextInputMode()
    }

    @objc private func pasteMessage() {
        pastedMessage = UIPasteboard.general.string?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
        primaryReply = ""
        alternateReplies = [:]
        setAlternateButtons(hidden: true)
        outputLabel.text = pastedMessage.isEmpty ? "Clipboard is empty." : "Message loaded. Choose a mode and Generate."
        statusLabel.text = pastedMessage.isEmpty ? "Copy the message you want SHIN to answer first." : "Ready."
    }

    @objc private func selectMode(_ sender: UIButton) {
        selectedMode = sender.accessibilityIdentifier ?? "shin"
        statusLabel.text = "\(selectedMode.capitalized) mode selected."
    }

    @objc private func generateReply() {
        guard !pastedMessage.isEmpty else {
            outputLabel.text = "Copy a message and tap Paste first."
            return
        }
        guard apiURL.host != "YOUR-SAEMACKIN-DOMAIN" else {
            outputLabel.text = "Set the production SaeMackin API URL in the Xcode target."
            return
        }

        task?.cancel()
        outputLabel.text = "SHIN is thinking…"
        statusLabel.text = "Generating \(selectedMode.capitalized)…"
        setAlternateButtons(hidden: true)

        var request = URLRequest(url: apiURL)
        request.httpMethod = "POST"
        request.timeoutInterval = 25
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: [
                "message": pastedMessage,
                "mode": selectedMode
            ])
        } catch {
            showError("Could not prepare the message.")
            return
        }

        task = URLSession.shared.dataTask(with: request) { [weak self] data, response, error in
            guard let self else { return }
            DispatchQueue.main.async {
                if let error {
                    self.showError(error.localizedDescription)
                    return
                }
                guard
                    let http = response as? HTTPURLResponse,
                    let data,
                    (200...299).contains(http.statusCode)
                else {
                    self.showError("SHIN could not generate a reply.")
                    return
                }

                do {
                    let decoded = try JSONDecoder().decode(KeyboardResponse.self, from: data)
                    self.primaryReply = decoded.reply
                    self.alternateReplies = [
                        "smooth": decoded.alternates.smooth,
                        "sauce": decoded.alternates.sauce,
                        "direct": decoded.alternates.direct
                    ]
                    self.outputLabel.text = decoded.reply
                    self.statusLabel.text = "Tap the reply to insert it, or choose an alternate."
                    self.setAlternateButtons(hidden: false)
                } catch {
                    self.showError("SHIN returned an unreadable response.")
                }
            }
        }
        task?.resume()
    }

    @objc private func insertPrimaryReply() {
        guard !primaryReply.isEmpty else { return }
        textDocumentProxy.insertText(primaryReply)
        statusLabel.text = "Inserted. You decide whether to Send."
    }

    @objc private func insertAlternate(_ sender: UIButton) {
        guard
            let key = sender.accessibilityIdentifier,
            let reply = alternateReplies[key],
            !reply.isEmpty
        else { return }
        textDocumentProxy.insertText(reply)
        statusLabel.text = "\(key.capitalized) reply inserted."
    }

    private func setAlternateButtons(hidden: Bool) {
        alternatesStack.arrangedSubviews.forEach { $0.isHidden = hidden }
    }

    private func showError(_ message: String) {
        primaryReply = ""
        alternateReplies = [:]
        setAlternateButtons(hidden: true)
        outputLabel.text = message
        statusLabel.text = "Try again or open SaeMackin Studio."
    }
}

private struct KeyboardResponse: Decodable {
    let reply: String
    let alternates: Alternates

    struct Alternates: Decodable {
        let smooth: String
        let sauce: String
        let direct: String
    }
}
