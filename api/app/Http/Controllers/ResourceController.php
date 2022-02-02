<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Contracts\RememberedController;
use App\Http\Controllers\Contracts\RememberedControllerContract;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

abstract class ResourceController extends Controller implements RememberedControllerContract
{
    use RememberedController;
    protected $model;

    /**
     *
     * @api {get} /
     * @apiName index
     * @apiGroup $model
     *
     * @apiSuccess (200) {object} model
     */
    public function index(Request $rec)
    {

        //return successful response
        /** @var Builder */
        $query = $this->model::query();
        if (isset($rec->limit) && isset($rec->offset)) {
            $query->skip($rec->offset)->take($rec->limit);
        }
        if (isset($rec->params)) {
            if (isset($rec->params['limit']) && isset($rec->params['offset'])) {
                $query->skip($rec->params['offset'])->take($rec->params['limit']);
            }
        }


        $this->filter($query, $rec);


        // $with = gettype($rec->with) == 'string' ? json_decode($rec->with, true) : $rec->with;
        if (!empty($rec->with)) {
            $query->with($rec->with);
        }
        if ($rec->params) {
            $query->with($rec->params['with']);
        }
        if (!empty($rec->orderBy)) {
            foreach ($rec->orderBy as $value) {
                $orders = explode(":", $value);
                $query->orderBy($orders[0], $orders[1]);
            }
            return $this->response($query->get());
        } else {
            return $this->response($query->orderBy('created_at', 'DESC')->get());
        }
    }
    /**
     *
     * @api {post} /model Request model information
     * @apiName store
     * @apiGroup model
     *
     * @apiParam  {Object} $request model data.
     *
     * @apiSuccess (200) {object} model
     *
     */
    public function store(Request $request)
    {
        try {
            //return successful response

            $model = new $this->model($request->all());
            $model->save();
            $this->addHistorical('create', $model, $model->id);
            $newModel = $this->model::find($model->id);
            if (!empty($request->with)) {
                $newModel->load($request->with);
            }
            return $newModel;
        } catch (\Exception $e) {
            //return error message
            Log::info($e);
            return response()->json(
                [
                    'message' => $e,
                ],
                409
            );
        }
    }
    /**
     *
     * @api {put} /model/:id Update model information
     * @apiName update
     * @apiGroup model
     *
     * @apiParam  {Object} $request model data.
     * @apiParam  {NUmber} $model_id id model unique ID.
     *
     * @apiSuccess (200) {object} model
     *
     */
    public function update(Request $request, $model_id)
    {

        try {
            Log::info($request->all());
            $model = $this->model::find($model_id);
            $this->addHistorical('update', $model, $model->id);
            $model->update($request->all());
            //return successful response
            return $model;
        } catch (\Exception $e) {
            //return error message
            return response()->json(
                [
                    'message' => $e,
                ],
                409
            );
        }
    }
    /**
     *
     * @api {get} /model/:id Show model information by ID.
     * @apiName show
     * @apiGroup model
     *
     * @apiParam  {Number} $model_id id model unique ID.
     *
     * @apiSuccess (200) {object} model
     *
     */
    public function show(Request $rec, $id)
    {

        try {

            $query = $this->model::query();

            if (!empty($rec->with)) {
                $query->with($rec->with);
            }
            $model = $query->find($id);
            $this->addHistorical('show', $model, $model->id);
            //return successful response
            return $this->response($model);
        } catch (\Exception $e) {
            //return error message
            return response()->json(
                [
                    'message' => $e,
                ],
                409
            );
        }
    }
    /**
     *
     * @api {delete} /model/:id Delete model information by ID.
     * @apiName delete
     * @apiGroup model
     *
     * @apiParam  {Number} $model_id id model unique ID.
     *
     * @apiSuccess (200) {object} model
     *
     */
    public function delete($model_id)
    {
        try {
            $model = $this->model::find($model_id);
            $this->addHistorical('delete', $model, $model->id);
            return $this->response($model->delete());
        } catch (\Exception $e) {
            //return error message
            return response()->json(
                [
                    'message' => $e,
                ],
                409
            );
        }
    }
    public function filter($query, $rec)
    {

        //filter relation   filtersLike: { "company.person:email": "test@test"},
        $filters = gettype($rec->filters) == 'string' ? json_decode($rec->filters, true) : $rec->filters;
        $filtersLike = gettype($rec->filtersLike) == 'string' ? json_decode($rec->filtersLike, true) : $rec->filtersLike;
        if ($rec->params) {

            $filtersPost = gettype($rec->params['filters']) == 'string' ? json_decode($rec->params['filters'], true) : $rec->params['filters'];
            if (!empty($filtersPost)) {
                $filters = $filtersPost;
            }
            $filtersLikePost = gettype($rec->params['filtersLike']) == 'string' ? json_decode($rec->params['filtersLike'], true) : $rec->params['filtersLike'];
            if (!empty($filtersLikePost)) {
                $filtersLike = $filtersLikePost;
            }
        }

        if (!empty($filters)) {
            foreach ($filters as $field => $value) {
                if ($value === null) {
                    $query->whereNull($field);
                } elseif ($value === "not null") {
                    $query->whereNotNull($field);
                } else {
                    $query->where($field, $value);
                }
            }
        }





        if (!empty($filtersLike)) {
            foreach ($filtersLike as $field => $value) {
                $query->where(function ($q) use ($filtersLike, $field) {
                    $q->where(function ($query) use ($filtersLike, $field) {
                        $count = 0;
                        foreach ($filtersLike as $field => $value) {
                            $relations = explode(":", $field);

                            //  return $relations;
                            if (sizeof($relations) > 1) {

                                if ($value !== "") {

                                    $query->where(function ($q) use ($relations, $value) {
                                        $q->orWhereHas($relations[0], function ($q) use ($relations, $value) {

                                            $q->where($relations[1], 'ilike', "%{$value}%");
                                        });
                                    });
                                }
                            } else {
                                if ($value != null) {
                                    if ($count == 0) {
                                        $query->orWhere($field, 'ilike', "%{$value}%");
                                    } else {


                                        $query->orWhere($field, 'ilike', "%{$value}%");
                                    }
                                }
                            }
                            $count = 1;
                        }
                    });
                });
            }
        }
    }
    public function response($model)
    {
        return response()->json(
            $model,
            200
        );
    }
}
