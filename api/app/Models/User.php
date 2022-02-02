<?php

namespace App\Models;


use App\Notifications\MailResetPasswordNotification;
use Illuminate\Auth\Authenticatable;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Log;
use Laravel\Lumen\Auth\Authorizable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Model implements AuthenticatableContract, AuthorizableContract, JWTSubject, CanResetPasswordContract
{
    use Authenticatable, Authorizable, SoftDeletes, CanResetPassword;

    protected $table = "user";

    protected $fillable = [

        "email",
        "password",
        "is_admin",
        "nickname",
        "person_id"

    ];

    protected $dates = ['deleted_at'];
    protected $hidden = ['password', 'updated_at', 'remember_token', 'deleted_at'];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }
    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    public function sendPasswordResetNotification($token)
    {
        $this->notify(new MailResetPasswordNotification($token));
    }
    public function historical()
    {
        return $this->morphMany(Historical::class, 'remembered');
    }
   

   
    public function canIdo($action)
    {

        $canIDo = false;
       
        foreach ($this->roles as $role) { //un usuario en una planta tiene roles
            foreach ($role->role->permissions as $permission) { //un rol tiene permisos
                if($permission->name == $action){
                    $canIDo = true;
                } 
            }
        }

        return $canIDo;
    }
}
