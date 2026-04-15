# IndexBoost — Fastly CDN (VCL)

Serve rendered HTML to crawlers at the Fastly edge using **custom VCL** (Varnish Configuration Language).

## Requirements

- A Fastly service with **custom VCL enabled** (contact Fastly support if not available on your plan)
- A backend pointing to `render.getindexboost.com` (configured in the Fastly UI)
- An Edge Dictionary for the token

## Setup

### 1. Create the IndexBoost backend

In **Fastly UI → Hosts → Create host**:

| Field | Value |
|---|---|
| Address | `render.getindexboost.com` |
| Port | `443` |
| TLS | Enabled |
| SNI hostname | `render.getindexboost.com` |
| Backend name | `indexboost_render` |

### 2. Create the Edge Dictionary

**Fastly UI → Dictionaries → Create dictionary**:

| Field | Value |
|---|---|
| Name | `indexboost_config` |
| Write-only | ✅ (recommended) |

Add entry: **key** = `token`, **value** = `your_token_here`

### 3. Upload the VCL

**Fastly UI → Edit Configuration → Custom VCL → Upload**

Upload `fastly.vcl` as the main VCL file. If you already have custom VCL, merge the relevant `sub` blocks.

### 4. Activate

Click **Activate** to deploy.

## How It Works

1. `vcl_recv` checks the `User-Agent` against the crawler pattern.
2. If the request is from a crawler and not a static asset, the backend is switched to `indexboost_render` and the URL is rewritten to `/?url={encoded_original_url}`.
3. The `X-INDEXBOOST-TOKEN` header is injected from the Edge Dictionary.
4. The render response is delivered directly to the crawler.
5. On any backend error (`vcl_error`), Fastly restarts with the origin backend.

## Notes

- VCL's `urlencode()` is available in Fastly's extended VCL.
- The `table.lookup()` function reads from the Edge Dictionary.
- Replace `F_origin` in `vcl_error` with your actual origin backend name.
- For simpler setups without custom VCL, consider using **Fastly Compute** (WASM) with a JavaScript/Rust worker instead.

## Configuration

| Dictionary Key | Required | Description |
|---|---|---|
| `token` | ✅ | Your IndexBoost API token (in `indexboost_config` dictionary) |
