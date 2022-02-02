<?php

namespace App\Http\Controllers\Security;

use App\Http\Controllers\ResourceController;
use App\Models\Permission;
use Illuminate\Http\Request;

class PermissionController extends ResourceController
{
    protected $model = Permission::class;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
         $this->middleware('auth:api');
         $this->middleware('admin', ['only' => ['index', 'show','delete','update','store']]);
    }

    /**
     *
     * @api {post} /permission/ Create permission params
     * @apiName create
     * @apiGroup security
     *
     * @apiParam {String} $request data
     *
     * @apiSuccess (200) {String} data permission
     *
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string|max:50',
            'description' => 'required|string|max:100',
        ]);
        return parent::store($request);
    }

    /**
     *
     * @api {post} /permission/:id Edit permission params
     * @apiName update
     * @apiGroup security
     *
     * @apiParam {String} $request data permission
     * @apiParam {Number} $permission_id ID in permission
     *
     * @apiSuccess (200) {String} data permission
     *
     */
    public function update(Request $request, $model_id)
    {
        $this->validate($request, [
            'name' => 'required|string|max:100',
            'description' => 'required|string|max:100',
        ]);
        return parent::update($request, $model_id);
    }
}
