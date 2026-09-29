import UIKit

final class KeyboardViewController: UIInputViewController {
    private let stack = UIStackView()
    private let outputLabel = UILabel()
    private var selectedMode = "shin"
    private var pastedMessage = ""

    override func viewDidLoad() {
        super.viewDidLoad()
        configureUI()
    }

    private func configureUI() {
        stack.axis = .vertical
        stack.spacing = 8
        stack.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(stack)

        let actions = UIStackView()
        actions.distribution = .fillEqually
        actions.spacing = 6

        actions.addArrangedSubview(button("🌐", action: #selector(nextKeyboard)))
        actions.addArrangedSubview(button("Paste", action: #selector(pasteMessage)))
        actions.addArrangedSubview(button("SHIN", action: #selector(generateReply)))

        outputLabel.numberOfLines = 3
        outputLabel.font = .systemFont(ofSize: 14)
        outputLabel.text = "Copy a message, tap Paste, then SHIN."
        outputLabel.isUserInteractionEnabled = true
        outputLabel.addGestureRecognizer(UITapGestureRecognizer(target: self, action: #selector(insertReply)))

        stack.addArrangedSubview(actions)
        stack.addArrangedSubview(outputLabel)

        NSLayoutConstraint.activate([
            stack.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 8),
            stack.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -8),
            stack.topAnchor.constraint(equalTo: view.topAnchor, constant: 8),
            stack.bottomAnchor.constraint(lessThanOrEqualTo: view.bottomAnchor, constant: -8)
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
        pastedMessage = UIPasteboard.general.string ?? ""
        outputLabel.text = pastedMessage.isEmpty ? "Clipboard is empty." : "Ready. Tap SHIN."
    }

    @objc private func generateReply() {
        guard !pastedMessage.isEmpty else {
            outputLabel.text = "Copy a message and tap Paste first."
            return
        }
        // Wire this to POST /api/keyboard after the native host app is created.
        outputLabel.text = "SHIN API foundation is ready."
    }

    @objc private func insertReply() {
        guard let reply = outputLabel.text, !reply.isEmpty else { return }
        textDocumentProxy.insertText(reply)
    }
}
