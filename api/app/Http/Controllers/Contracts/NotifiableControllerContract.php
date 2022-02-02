<?php

namespace App\Http\Controllers\Contracts;

use Illuminate\Http\Request;

interface NotifiableControllerContract
{
    public function dataNotifiable(Request $request, $model_id);
    public function notes(Request $request,string $model_id);
    public function noteDelete(string $model_id, string $note_id);
    public function noteUpdate(Request $request, $model_id, $note_id);

}
