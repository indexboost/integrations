<?php

namespace IndexBoost\Laravel;

use Illuminate\Support\ServiceProvider;

class IndexBoostServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__ . '/../config/indexboost.php', 'indexboost');
    }

    public function boot(): void
    {
        $this->publishes([
            __DIR__ . '/../config/indexboost.php' => config_path('indexboost.php'),
        ], 'indexboost-config');
    }
}
