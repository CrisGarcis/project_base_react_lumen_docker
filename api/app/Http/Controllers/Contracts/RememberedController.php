<?php

namespace App\Http\Controllers\Contracts;

use Illuminate\Support\Facades\Auth;
trait RememberedController
{
    public function addHistorical($action, $request, $model_id)
    {
        $person_id = (Auth::check()) ? Auth::user()->id : null;
        return $this->model::find($model_id)->historical()->create(array('action' => $action, 'user_id' => $person_id, 'before_value' => json_encode(($request))));
    }

    public function historical(string $model_id)
    {
        return $this->model::find($model_id)->historical()->get();
    }
}