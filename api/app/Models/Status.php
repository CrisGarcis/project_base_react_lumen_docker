<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Status extends Model
{

 

    protected $table = 'status';

    protected $fillable = [
        "name"
    ];

    protected $dates = ['deleted_at'];
    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];

    public function historical()
    {
        return $this->morphMany(Historical::class, 'remembered');
    }
    
}
