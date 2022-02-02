<?php

namespace App\Http\Controllers\Contracts;

use App\Models\Status;
use App\Models\StatusScope;
use App\Models\ConfigPlant;

use Illuminate\Http\Request;

trait ChangeableController
{
   public function getJson(Request $request, $code){
    $plant_id = $request->header("plant");
    if($plant_id){
        $config = ConfigPlant::select('json->' . $code . ' as config')->where('code', $code)->where('company_plant_id', $plant_id)->first();
       return json_decode($config['config'], true);
    }
   }
    public function getStatus(Request $request, $code)
    {
        $plant_id = $request->header("plant");
        if($plant_id){
            $config = ConfigPlant::select('json->' . $code . ' as config')->where('code', $code)->where('company_plant_id', $plant_id)->first();
            $allStatus = json_decode($config['config'], true);
            $query = "CASE ";
            foreach ($allStatus as $key => $value) {
                $query = $query . " WHEN id=$value THEN " . $key;
            }
            $query = $query . " ELSE 0
            END,id;";
            return Status::whereIn('id', $allStatus)->orderByRaw($query)
                ->get();
        }else{
            return response()->json(
                [
                    'message' => "planta es requerida en la cabecera de petición",
                ],
                409
            );
        }
       
    }

    public function nextStatus($model_id)
    {
        return $this->compareStatusPostgress('transitions', $model_id);
    }
    private function findStatus($model_id, $field_name)
    {
        $model = $this->model::find($model_id);
        $allStatus = $model->getStatus();
        return  $allStatus[$field_name];
    }
    private function compareStatusPostgress($field_name, $model_id = false)
    {
        $model = $this->model::find($model_id);
        $allStatus = json_decode($model->getStatus()['config'], true);

        $ids = $allStatus[$field_name];
        switch ($field_name) {
            case 'transitions':
                try {
                    $ids = $allStatus[$field_name][$model->status_id];
                } catch (\Throwable $th) {
                    return response()->json(
                        [
                            'message' => "campo status_id no existe",
                        ],
                        409
                    );
                }

                break;
        }

        $query = "CASE ";
        foreach ($ids as $key => $value) {
            $query = $query . " WHEN id=$value THEN " . $key;
        }
        $query = $query . " ELSE 0
        END,id;";
        return Status::whereIn('id', $ids)->orderByRaw($query)
            ->get();
    }
}
