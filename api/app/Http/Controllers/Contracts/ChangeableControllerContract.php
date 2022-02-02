<?php

namespace App\Http\Controllers\Contracts;

use Illuminate\Http\Request;

interface ChangeableControllerContract
{
    public function getJson(Request $request, string $code);
    public function getStatus(Request $request, string $code);
    public function nextStatus(string $model_id);
}
