# Firebase Hosting + Cloud Functions

No npm package required — deploy the Cloud Function.

See the full guide in [`firebase/README.md`](./firebase/README.md).

## Quick start

1. Copy the function from [`firebase/functions/`](./firebase/functions/) into your Firebase Functions project.
2. Set your token: `firebase functions:config:set indexboost.token="YOUR_TOKEN"`
3. Add the rewrite rule from [`firebase/firebase.json`](./firebase/firebase.json) to your `firebase.json`.
4. Deploy: `firebase deploy --only functions,hosting`

## How it works

A Firebase Cloud Function intercepts HTTP requests, detects crawler `User-Agent` strings, and proxies those requests to `https://render.getindexboost.com/`. Human traffic is served by Firebase Hosting normally.
