<?php

namespace App\Http\Controllers\Contracts;

use App\Models\Note;
use Illuminate\Http\Request;
trait NotifiableController
{
    public function dataNotifiable(Request $request, $model_id)
    {$this->validate($request, [
        'note' => 'required|string',
    ]);

        return $this->model::find($model_id)->notes()->create($request->all());
    }

    public function notes(Request $rec,string $model_id)
    {
        $query = $this->model::find($model_id)->notes();

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
    public function noteDelete(string $model_id, string $note_id)
    {
        return $this->model::find($model_id)->notes()->where('id', $note_id)->delete();
    }
    public function noteUpdate(Request $request, $model_id, $note_id)
    {
        $note = Note::find($note_id);
        $note->update($request->all());
        return $note;

    }

}
