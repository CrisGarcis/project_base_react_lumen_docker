<?php

namespace App\Http\Controllers\Contracts;

use Carbon\Carbon;
use App\Models\Person;
use App\Models\Company;
use App\Models\Note;
use Illuminate\Support\Facades\Log;

use App\Models\Document;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

trait DocumentableController
{

    public function documents(Request $rec, string $model_id)
    {
        $query = $this->model::find($model_id)->documents();

        $filters = gettype($rec->filters) == 'string' ? json_decode($rec->filters, true) : $rec->filters;
        if (!empty($filters)) {
            foreach ($filters as $field => $value) {
                if ($value === null) {
                    $query->whereNull($field);
                } else {
                    $query->where($field, $value);
                }
            }
        }
        $filtersLike = gettype($rec->filtersLike) == 'string' ? json_decode($rec->filtersLike, true) : $rec->filtersLike;
        if (!empty($filtersLike)) {
            foreach ($filtersLike as $field => $value) {
                $query->where(function ($q) use ($filtersLike) {
                    $q->where(function ($query) use ($filtersLike) {
                        $count = 0;
                        foreach ($filtersLike as $field => $value) {

                            if ($value != null) {
                                if ($count == 0) {
                                    $query->where($field, 'ilike', "%{$value}%");
                                } else {
                                    $query->orWhere($field, 'ilike', "%{$value}%");
                                }
                            }
                            $count = 1;
                        }
                    });
                });
            }
        }

        if (!empty($rec->with)) {
            $query->with($rec->with);
        }

        return $query->get();
    }
    public function addDocument(string $model_id, Request $request)
    {

          $this->validate($request, [
            'document' => 'required',
        ]);
       $this->createFile($request);
       $request->request->add(['company_plant_id' => $request->header('plant')]);
      $modelDocument=$this->model::find($model_id)->documents()->create($request->all());
     
    
         
        return $modelDocument;
    }
  

    public function documentDelete(string $model_id, string $document_id)
    {
        $model=$this->model::find($model_id);
        $document=Document::find($document_id);
       
        $model->documents()->where('id', $document_id)->delete();
    }
    public function createFile(Request $request)
    {

    $path = storage_path("app/Documents");
        $file = $request->file('document');
        //Get the file size in bytes.
        $fileSizeBytes = filesize($file);
        //Convert the bytes into MB.
        $fileSizeMB = number_format($fileSizeBytes / 1024 / 1024, 4);

        $ext = strtolower($file->getClientOriginalExtension());
        $current_timestamp = Carbon::now()->toDateTimeString();
        $name = md5($current_timestamp.$fileSizeMB.$file->getClientOriginalName());
        $request->merge(['name' => $name]);
        if(!$request->title){
            $request->merge(['title' => $file->getClientOriginalName()]);
        }

        $request->merge(['size_mb' => $fileSizeMB]);
        $request->merge(['real_path' => $path . "/" . $name.".".$ext]);
        $request->merge(['type' => $ext]);
        $file->move($path, $name.".".$ext);
        return $request;


    }

    public function deleteAndAddDocument(string $model_id, Request $request)
    {

        $model = $this->model::find($model_id);
        $model->documents()->where('role', $request->role)->delete();
        $data = $this->createFile($request);
        return $this->model::find($model_id)->documents()->create($data->all());

        return response()->json(
            $model,
            200
        );
    }
}
