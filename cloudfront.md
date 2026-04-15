# Amazon CloudFront — Lambda@Edge

No npm package required — deploy the Lambda@Edge function.

See the full guide in [`cloudfront/README.md`](./cloudfront/README.md).

## Quick start

1. Zip and upload [`cloudfront/lambda/index.js`](./cloudfront/lambda/index.js) as a Lambda function in `us-east-1`.
2. Set the `INDEXBOOST_TOKEN` environment variable (or embed it in the function).
3. Associate the Lambda function as a **Viewer Request** trigger on your CloudFront distribution.

## How it works

The Lambda@Edge function runs on every viewer request. It detects crawler `User-Agent` strings and, for those requests, fetches the rendered page from `https://render.getindexboost.com/` and returns it directly. All other requests are served normally by CloudFront.
