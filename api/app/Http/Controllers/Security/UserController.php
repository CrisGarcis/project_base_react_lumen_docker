<?php

namespace App\Http\Controllers\Security;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\ResourceController;
use App\Models\Permission;
use App\Models\Person;
use App\Models\UserPlant;
use Faker\Provider\UserAgent;
use Illuminate\Support\Facades\Auth;

class UserController extends ResourceController
{


    protected $model = User::class;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => array('')]);
        $this->middleware('permission:view_user', ['only' => ['index', 'show']]);
        $this->middleware('admin', ['only' => ['delete']]);
        $this->middleware('permission:update_user', ['only' => ['update', 'store']]);
    }

    /**
     *
     * @api {post} /employe/ Create employe params
     * @apiName store
     * @apiGroup general
     *
     * @apiParam {String} $request data
     *
     * @apiSuccess (200) {String} data employe
     *
     */
    public function store(Request $request)
    {
        $this->validate($request, [

            'first_name' => 'required|max:80',
            'last_name' => 'required|max:80',
            'id_number' => 'required',
            'password' => 'required',
            'email' =>    'required',
        ]);
        $person = Person::where('id_number')->first();

        if (!$person) {
            $personComtroller = new PersonController;
            $person = $personComtroller->store($request);
        }
        $user = $this->model::where('email', $request->email)->first();

        if (!$user) {
            $request->request->add(['person_id' => $person->id]);
            $request->request->add(['email' => strtolower($request->email)]);
            $request->request->add(['password' => app('hash')->make($request->password)]); //add request
            $user = parent::store($request);
        }


        if (isset($request->company_plant_id)) {
            $user->userPlants()->attach($request->company_plant_id);
        }
        $user->load('userPlants');
        return $user;
    }

    public function getPermissions(Request $request)
    {
        $plant_id = $request->header('plant');
        if (!$plant_id) {
            return response()->json(
                [
                    'message' => "Se requiere planta para verificar los permisos",
                ],
                401
            );
        }
        try {
            return UserPlant::join('user_plant_role', 'user_plant.id', '=', 'user_plant_role.user_plant_id')
                ->join('role', 'user_plant_role.role_id', '=', 'role.id')
                ->join('role_permission', 'role.id', '=', 'role_permission.role_id')
                ->join('permission', 'role_permission.permission_id', '=', 'permission.id')
                ->where('user_plant.user_id', Auth::user()->id)
                ->where('user_plant.company_plant_id', $plant_id)
                ->groupBy('permission.name')
                ->pluck('permission.name')->toArray();
        } catch (\Throwable $th) {
            return $th;
            return response()->json(
                [
                    'message' => "Error al intentar obtener los permisos",
                ],
                401
            );
        }
    }
}
