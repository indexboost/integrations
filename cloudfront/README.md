# IndexBoost — Amazon CloudFront + Lambda@Edge

Serve rendered HTML to crawlers using **Lambda@Edge** as a **Viewer Request** trigger on your CloudFront distribution.

## How It Works

Lambda@Edge intercepts every viewer request before it reaches the origin. When the `User-Agent` belongs to a known crawler and the path is not a static asset, the function fetches the rendered HTML from IndexBoost and returns it directly from the edge. All other requests continue to the origin unchanged.

## Deployment

### 1. Package the Lambda

```bash
cd lambda/
npm install   # no dependencies needed — uses Node built-ins
zip -r function.zip index.js
```

### 2. Create the Lambda function

1. Open **AWS Lambda** → **Create function**
2. Region: **us-east-1** (Lambda@Edge requirement)
3. Runtime: **Node.js 20.x**
4. Upload `function.zip`
5. Set memory: **128 MB**, timeout: **5 seconds**

### 3. Set the token

Add an environment variable (or, for Viewer Request triggers, bake the token in at deploy time via a build parameter/SSM):

```bash
aws lambda update-function-configuration \
  --function-name indexboost-render \
  --environment "Variables={INDEXBOOST_TOKEN=your_token_here}"
```

> **Note:** Lambda@Edge does not support environment variables natively. The recommended approach is to hardcode the token during CI/CD using a build step that reads from SSM Parameter Store.

### 4. Publish a version

```bash
aws lambda publish-version --function-name indexboost-render
```

### 5. Attach to CloudFront

1. In your CloudFront distribution → **Behaviors** → **Edit** the default (`/*`)
2. Under **Function associations** → **Viewer request** → Choose **Lambda@Edge**
3. Paste the Lambda ARN (with version, e.g. `arn:aws:lambda:us-east-1:123456789:function:indexboost-render:1`)
4. Deploy the distribution

## IAM Permissions

The Lambda execution role needs:

```json
{
  "Effect": "Allow",
  "Action": ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"],
  "Resource": "arn:aws:logs:*:*:*"
}
```

And the trust policy must allow both `lambda.amazonaws.com` and `edgelambda.amazonaws.com`.

## Configuration

| Variable | Description |
|---|---|
| `INDEXBOOST_TOKEN` | Your IndexBoost API token |

## Notes

- Lambda@Edge functions must be deployed to **us-east-1**.
- The function body size limit for Viewer Request is **1 MB**.
- Response body limit for Viewer Request is **40 KB** — if your HTML is larger, use **Origin Request** instead and stream the response.
