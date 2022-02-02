<?php

namespace App\Http\Controllers\Contracts;

use Illuminate\Http\Request;

interface DocumentableControllerContract
{

    public function documentDelete(string $model_id, string $note_id);
    public function documents(Request $rec, string $model_id);
    public function addDocument(string $model_id, Request $request);
    public function createFile(Request $request);
    public function deleteAndAddDocument(string $model_id, Request $request);
}
