# Symfony

No Composer package required — copy the Event Subscriber class.

See the full guide in [`symfony/README.md`](./symfony/README.md).

## Quick start

1. Copy [`symfony/src/EventSubscriber/IndexBoostSubscriber.php`](./symfony/src/EventSubscriber/IndexBoostSubscriber.php) into your `src/EventSubscriber/` directory.
2. Register it in `config/services.yaml` if not using autoconfigure.
3. Set `INDEXBOOST_TOKEN` in your `.env` file.

## How it works

A Symfony `kernel.request` event subscriber intercepts requests from known crawlers and returns the rendered HTML fetched from `https://render.getindexboost.com/`. All other requests continue through the normal Symfony kernel.
