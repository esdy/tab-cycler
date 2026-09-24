# Tab Cycler

A small browser extension that automatically switches through your tabs and
refreshes each one on a timer. Useful for dashboards, monitoring screens and
kiosks.

## Features

- Cycles through every tab in a window and reloads each one
- Configurable interval (minimum 30 seconds)
- Choose a specific browser window, or follow the currently focused one
- Toolbar badge shows when it is running
- No data collected, no network requests

## Usage

1. Click the toolbar icon (pin it from the puzzle-piece menu if it is hidden).
2. Set the interval in seconds.
3. Pick a window, or leave it on "Currently focused window".
4. Press **Start**. Press **Stop** to end the loop.

Changing the interval or window while it is running restarts the loop with the
new values. If the chosen window is closed, cycling stops automatically.

## Project structure

```
tab-cycler/
├── manifest.json     Extension manifest (Manifest V3, Chromium + Firefox)
├── background.js     Timer and tab-cycling logic
├── popup.html        Settings popup
├── popup.js          Popup behaviour
└── icons/            16, 32, 48 and 128 px placeholder icons
```

## Install for development

**Chrome, Edge, Brave, Opera, Vivaldi**

1. Open `chrome://extensions` (or `edge://extensions`, `brave://extensions`).
2. Turn on **Developer mode**.
3. Click **Load unpacked** and select this folder.

**Firefox**

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on** and select `manifest.json`.

Temporary add-ons are removed when Firefox restarts.

**Safari**

```
xcrun safari-web-extension-converter /path/to/tab-cycler
```

Then build and run the generated project in Xcode.

## Configuration notes

- **Minimum interval is 30 seconds.** This is the smallest period
  `chrome.alarms` reliably supports.
- **Window IDs reset when the browser restarts.** Re-select the window in the
  popup after a restart.
- **Backgrounded windows can be throttled.** If cycling stalls while another app
  is in front, turn off Memory Saver / Energy Saver in the browser settings,
  and on Windows disable `chrome://flags/#calculate-native-win-occlusion`.
- Some pages (`chrome://` pages, the Web Store) cannot be reloaded by extensions.

## Permissions

| Permission | Why it is needed |
|---|---|
| `tabs` | To list, activate and reload the user's tabs |
| `alarms` | To run the timer reliably while the background worker sleeps |
| `storage` | To remember the interval, selected window and running state |

## Packaging for the stores

Zip the **contents** of the folder so `manifest.json` sits at the top level of
the archive, not inside a subfolder.

```
cd tab-cycler
zip -r ../tab-cycler-1.1.0.zip . -x "*.DS_Store" "README.md"
```

The same zip can be submitted to the Chrome Web Store, Microsoft Edge Add-ons
and Firefox Add-ons (AMO). Increase `version` in `manifest.json` for every
update.

## Before publishing

- Replace `tab-cycler@example.com` in `browser_specific_settings.gecko.id` with
  an ID you own (an email-style string or a UUID in braces). It must stay the
  same for the life of the Firefox add-on.
- Replace `homepage_url` with your real repository or site.
- Replace the placeholder icons in `icons/` with your final artwork.
- Prepare store screenshots (1280x800 recommended) and a short description.

## Privacy

Tab Cycler does not collect, store remotely or transmit any data. Settings are
kept locally in the browser via `chrome.storage.local`.

## License

MIT © 2026 dwanjala.com
