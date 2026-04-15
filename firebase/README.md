# IndexBoost — Firebase Hosting + Cloud Functions

Route crawler traffic to the IndexBoost render service using **Firebase Hosting rewrites** and a **Cloud Function** as the render proxy.

## How It Works

Firebase Hosting rewrites every request (that doesn't match a static file) to the `render` Cloud Function. The function checks the `User-Agent`: if it's a known crawler, it fetches the rendered HTML from IndexBoost and returns it. Otherwise it returns a 404, which causes Firebase Hosting to fall back to the SPA index.

## Setup

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
firebase init hosting functions
```

### 2. Copy the files

Replace or merge your `firebase.json` with the one provided. Copy `functions/index.js` into your project's `functions/` directory.

### 3. Install function dependencies

```bash
cd functions/
npm install
```

### 4. Set the IndexBoost token

```bash
firebase functions:config:set indexboost.token="your_token_here"
```

Or set it as an environment variable for the 2nd-gen functions approach:

```bash
firebase functions:secrets:set INDEXBOOST_TOKEN
```

For the environment variable approach, update `functions/index.js`:

```js
const token = process.env.INDEXBOOST_TOKEN;
```

### 5. Deploy

```bash
firebase deploy
```

## Configuration

| Variable | Required | Description |
|---|---|---|
| `INDEXBOOST_TOKEN` | ✅ | Your IndexBoost API token |

## Notes

- The Cloud Function returns **404** for non-crawler requests so Firebase Hosting falls back to serving static files / the SPA index.
- Set the function **region** to the one closest to your users (default: `us-central1`).
- For large HTML responses, increase the function **memory** to 256 MB.
