<?php
namespace App\Http\Controllers\Security;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\UserPlant;
use App\Models\Role;

use Illuminate\Http\Request;

class ActionsController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api');
        // $this->middleware('permission:show_persons');
    }

    public function personAttachProfile($person_id, Request $request)
    {
        $this->validate($request, [
            'roles' => 'required',
        ]);
        $person = UserPlant::find($person_id);
        if ($request->roles != "") {
            $porciones = explode(",", $request->roles);
            $person->profiles()->sync($porciones);
        }
        return $person->profiles;
    }
    public function personDetachProfile(Request $request)
    {
        $person = UserPlant::find($request->person_id);
        $profile = Role::find($request->profile_id);
        $person->profiles()->detach($profile);
    }
    public function profileAttachPermission($profile_id, Request $request)
    {
        $this->validate($request, [
            'permissions' => 'required',
        ]);
        $profile = Role::find($profile_id);
        if ($request->permissions != "") {
            $porciones = explode(",", $request->permissions);
            $profile->permissions()->sync($porciones);
        }
        return $profile->permissions;
    }
    public function permissionDetachProfile(Request $request)
    {
        $profile = Role::find($request->profile_id);
        $permission = Permission::find($request->permission_id);
        $profile->permissions()->detach($permission);
    }
   

}
