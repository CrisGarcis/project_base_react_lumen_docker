<?php

use App\Models\User;
use App\Models\Permission;
use App\Models\Role;
use App\Models\CompanyPlant;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $role1 = Role::create([
            'name' => 'super-admin',
            'description' => 'administrador de sistema'
        ]);
        
        ///////Permission////

        // <ACTIVATION_LINE
        Permission::create([
            'name' => 'view_activation_line',
            'description' => 'ver activaciones de linea'
        ]);
        Permission::create([
            'name' => 'update_activation_line',
            'description' => 'modificar activaciones de linea'
        ]);
        Permission::create([
            'name' => 'delete_activation_line',
            'description' => 'eliminar la activacion de linea'
        ]);


       
        // USER/>


        $allIdsPermissions = Permission::where(function ($q) {
            $q->orWhere('name', 'ilike', '%view%')
                ->orWhere('name', 'ilike', '%update%');
        })->get()->pluck('id')->toArray();
        $role1->permissions()->sync($allIdsPermissions);
    }
}
