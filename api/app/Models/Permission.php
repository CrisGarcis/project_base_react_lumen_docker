<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Permission extends Model
{

    use SoftDeletes;

    protected $table = 'permission';

    protected $fillable = [
        "name",
        "description"
    ];

    protected $dates = ['deleted_at'];
    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];

    public function historical()
    {
        return $this->morphMany(Historical::class, 'remembered');
    }
    
}
