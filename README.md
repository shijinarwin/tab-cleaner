# tab-cleaner

A Chrome extension that groups open tabs by domain and removes duplicates. If you have 6 tabs open for `github.com` across different paths, it closes 5 and keeps 1.

## Why

Browser tab sprawl is real. I kept opening tabs from the same sites during research sessions and ended up with 40+ tabs, half of which were duplicates from the same domains. This fixes that with one click.

## What it does

- Groups tabs by domain (ignores paths, query strings, etc.)
- Removes duplicate tabs from the same domain, keeping the first one open
- Organizes remaining tabs into Chrome tab groups labeled by domain

## Install

1. Clone or download this repo
2. Go to `chrome://extensions`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** and select this folder

No build step. No npm. Just load it directly.

## Usage

Click the extension icon in your toolbar.

- **Clean & Group Tabs** - removes duplicates and groups remaining tabs by domain
- **Remove Duplicates Only** - closes duplicate tabs without grouping

The popup shows a quick summary of how many tabs, domains, and duplicates you currently have.

## Tech

Plain JavaScript (ES modules), Chrome Extension Manifest V3. No build tools, no dependencies.

## Notes

- Requires Chrome 89+ (tabGroups API)
- Only operates on tabs in the current window
- "Duplicate" means same domain - `github.com/foo` and `github.com/bar` count as duplicates

## License

MIT
