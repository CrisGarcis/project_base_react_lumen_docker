<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserRole extends Model
{

    use SoftDeletes;

    protected $table = 'user_role';

    protected $fillable = [
        "user_id",
        "role_id"
    ];


    protected $dates = ['deleted_at'];
    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];

    public function historical()
    {
        return $this->morphMany(Historical::class, 'remembered');
    }
    public function role(){
        return $this->belongsTo(Role::class);
    }
}
