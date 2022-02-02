<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Session extends Model
{

    use SoftDeletes;

    protected $table = 'session';

    protected $fillable = [
        "person_id",
        "ip_address",
        "browser",
        "date",
        "token",
        "data",
        "fb_token",
        "gl_token",
        "end_date",
        "end_work_date"
    ];

    protected $dates = ['deleted_at'];
    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];

    public function sessionPerson()
    {
        return $this->belongsTo(Person::class);
    }
    public function historical()
    {
        return $this->morphMany(Historical::class, 'remembered');
    }
}
