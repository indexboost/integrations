# IndexBoost — Akamai EdgeWorkers

Serve rendered HTML to crawlers at the Akamai edge using **EdgeWorkers**.

## Requirements

- An Akamai contract with **EdgeWorkers** enabled
- Akamai CLI with the EdgeWorkers plugin: `akamai install edgeworkers`

## Setup

### 1. Create the EdgeWorker

```bash
# Authenticate
akamai login

# Create a new EdgeWorker ID
akamai edgeworkers create-id \
  --groupId YOUR_GROUP_ID \
  --name "indexboost-render" \
  --resourceTierId YOUR_RESOURCE_TIER_ID
```

Note the returned EdgeWorker ID.

### 2. Configure the token in Property Manager

1. Open **Akamai Control Center** → **Property Manager** → your property
2. Go to **Variables** → **Create Variable**
   - Name: `PMUSER_INDEXBOOST_TOKEN`
   - Initial value: `your_token_here`
   - Mark as **sensitive/hidden** so it's not logged
3. Save the property version

### 3. Bundle and deploy the EdgeWorker

```bash
cd akamai/

# Create the bundle zip (must contain main.js and bundle.json at root)
zip -j indexboost-ew.zip src/main.js bundle.json

# Upload the bundle
akamai edgeworkers upload \
  --edgeWorkerId YOUR_EW_ID \
  --bundle indexboost-ew.zip

# Activate on staging first
akamai edgeworkers activate \
  --edgeWorkerId YOUR_EW_ID \
  --network STAGING \
  --version 1.0.0

# Then activate on production
akamai edgeworkers activate \
  --edgeWorkerId YOUR_EW_ID \
  --network PRODUCTION \
  --version 1.0.0
```

### 4. Attach the EdgeWorker to your property

1. In **Property Manager**, add the **EdgeWorkers** behavior to your default rule (or a specific rule)
2. Set the EdgeWorker ID to the one created above
3. Save and activate the property version

## How It Works

The `onClientRequest` hook runs at the edge for every request. It:

1. Reads the `User-Agent` header and checks it against the crawler pattern.
2. If not a crawler or if the path is a static asset, returns immediately (Akamai handles normally).
3. Reads `PMUSER_INDEXBOOST_TOKEN` from Property Manager variables.
4. Fetches `https://render.getindexboost.com/?url={encoded_url}` with `X-INDEXBOOST-TOKEN`.
5. Calls `request.respondWith()` to return the rendered HTML directly.
6. On any error, falls through to normal Akamai delivery.

## Configuration

| PM Variable | Required | Description |
|---|---|---|
| `PMUSER_INDEXBOOST_TOKEN` | ✅ | Your IndexBoost token (set in Property Manager) |

## Notes

- EdgeWorkers use the **Akamai EdgeWorkers JS API** which differs from standard browser/Node.js environments. `httpRequest` is the Akamai-specific fetch equivalent.
- The `UserVariables` module reads Property Manager user variables.
- Set appropriate **CPU time limits** in your EdgeWorker policy for the network call overhead.
