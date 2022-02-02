<?php

return [

    'default' => 'pgsql',
    'migrations' => 'migrations',
    'connections' => [
        'pgsql' => [

            'driver' => env('DB_CONNECTION'),
            'host' => env('DB_HOST'),
            'port' => env('DB_PORT'),
            'database' => env('DB_DATABASE'),
            'username' => env('DB_USERNAME'),
            'password' => env('DB_PASSWORD'),
        ]
    ],
];
