<?php

namespace App\Http\Controllers\Contracts;

interface RememberedControllerContract
{
    public function addHistorical(string $action, $data = null, $model_id);
    public function historical(string $model_id);
}
