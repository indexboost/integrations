<?php

namespace IndexBoost\Laravel\Tests;

use Orchestra\Testbench\TestCase as OrchestraTestCase;
use IndexBoost\Laravel\IndexBoostServiceProvider;

abstract class TestCase extends OrchestraTestCase
{
    protected function getPackageProviders($app): array
    {
        return [IndexBoostServiceProvider::class];
    }

    protected function defineEnvironment($app): void
    {
        $app['config']->set('indexboost.token', 'test-token-12345');
        $app['config']->set('indexboost.service_url', 'https://render.getindexboost.com');
        $app['config']->set('indexboost.enabled', true);
        $app['config']->set('indexboost.timeout', 30);
        $app['config']->set('indexboost.crawler_pattern', 'googlebot|bingbot|gptbot|claudebot');
        $app['config']->set('indexboost.ignored_uris', ['/^\/api\//', '/^\/admin\//']);
    }
}
