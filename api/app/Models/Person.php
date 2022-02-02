<?php

namespace App\Models;



use Illuminate\Auth\Authenticatable;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Person extends Model 
{
  

    protected $table = "person";

    protected $fillable = [
        "first_name",
        "last_name",
        "id_number",
        "gender"
    ];

    protected $dates = ['deleted_at'];
    protected $hidden = ['password', 'updated_at', 'remember_token', 'deleted_at'];
  
    public function historical()
    {
        return $this->morphMany(Historical::class, 'remembered');
    }
 
   

    
}
