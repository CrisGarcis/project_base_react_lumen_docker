<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Historical extends Model
{
    use SoftDeletes;
    protected $table = 'historical';
    protected $fillable = [
        'remembered_type',
        'remembered_id',
        'user_id',
        'before_value',
        "action",
    ];
    protected $dates = ['deleted_at'];
    protected $hidden = ['deleted_at', 'updated_at', 'created_at'];

    public function remembered()
    {
        return $this->morphTo();
    }
    public function user(){
        return $this->belongsTo(User::class);
    }

}