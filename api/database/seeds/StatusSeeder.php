<?php

use App\Models\Status;

use Illuminate\Database\Seeder;

class StatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Status::create([
            'id'=>1,
            'name' => 'creado'
        ]);
        Status::create([
            'id'=>2,
            'name' => 'activo'
        ]);
        Status::create([
            'id'=>3,
            'name' => 'inactivo'
        ]);
      
    }
}
