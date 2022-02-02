<?php

use App\Models\User;
use App\Models\Person;
use App\Models\Company;
use App\Models\CompanyPlant;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
       
        $user1 = User::create([
            'nickname' => 'CrisGarcis',
            'email' => 'desarrollo.crhonosiso@gmail.com',
            'is_admin'=>true,
            'password' => Hash::make('123456'),
        ]);
        
        
        DB::table('user_role')->insert([
            'user_id' => 1,
            'role_id' => 1

        ]);
        
    }
}
