<?php

namespace App\Http\Controllers\Security;

use App\Http\Controllers\ResourceController;
use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends ResourceController
{
    protected $model = Role::class;
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api');
        $this->middleware('admin', ['only' => ['delete','update','store']]);
        $this->middleware('permission:view_role', ['only' => ['index', 'show']]);

    }
  
}
