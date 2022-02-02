<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Role extends Model
{

    use SoftDeletes;

    protected $table = 'role';

    protected $fillable = [
        "name"
    ];

    protected $dates = ['deleted_at'];
    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];

    public function historical()
    {
        return $this->morphMany(Historical::class, 'remembered');
    }
    public function permissions(){
        return $this->belongsToMany(Permission::class,'role_permission');
    }
}
