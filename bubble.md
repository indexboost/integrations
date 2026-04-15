# Bubble (No-code)

No package required — configure via the IndexBoost Bubble plugin.

See the full guide in [`bubble/plugin-guide.md`](./bubble/plugin-guide.md).

## Quick start

1. Open your Bubble editor and go to **Plugins → Add plugins**.
2. Search for **IndexBoost** and install the plugin.
3. Paste your `INDEXBOOST_TOKEN` into the plugin settings.

## How it works

The IndexBoost Bubble plugin intercepts Bubble app requests from known crawler bots and serves them pre-rendered HTML via the IndexBoost render cache (`https://render.getindexboost.com/`). This ensures search engines always receive fully rendered content without any code changes.
