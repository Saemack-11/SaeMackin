# SHIN Reply — no-Mac iPhone Shortcut

SHIN Reply uses the same production intelligence as SHIN Keyboard, but works today without compiling an iOS app.

Endpoint:
`https://saemackin101.vercel.app/api/keyboard`

## Fastest workflow

1. Copy the incoming message.
2. Run **SHIN Reply** from Shortcuts, Siri, Back Tap, Action Button, or the Home Screen.
3. The Shortcut POSTs the clipboard text with `mode: auto`.
4. SHIN reads the room and returns the best reply.
5. The Shortcut copies `reply` back to the clipboard and shows it.
6. Paste it into the original conversation and press Send yourself.

## Shortcut actions

1. **Get Clipboard**
2. **Get Contents of URL**
   - URL: `https://saemackin101.vercel.app/api/keyboard`
   - Method: POST
   - Request Body: JSON
   - `message`: Clipboard
   - `mode`: Text value `auto`
3. **Get Dictionary Value**
   - Key: `reply`
   - Dictionary: Contents of URL
4. **Copy to Clipboard**
5. **Show Result**

Optional: also read `selected_mode` if you want the Shortcut to display whether SHIN chose Smooth, Sauce, Direct, Solid, Funny, or standard SHIN.

## Privacy boundary

The Shortcut sends only the clipboard text you explicitly copied when you run it. It does not read the surrounding conversation and never sends a message on your behalf.
