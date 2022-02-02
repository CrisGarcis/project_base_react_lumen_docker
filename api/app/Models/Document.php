<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Document extends Model
{
    use SoftDeletes;

    protected $table = 'document';

    protected $fillable = [
        "name",
        "title",
        "description",
        "type",
        "role",
        "real_path",
        "is_private",
        "size_mb",
        "references",
        "documentable_id",
        "documentable_type",
        "status_id",
        "company_plant_id"
    ];

    protected $dates = ['deleted_at'];
    protected $hidden = ['deleted_at'];

    public function documentable()
    {
        return $this->morphTo();
    }


    public function historical()
    {
        return $this->morphMany(Historical::class, 'remembered');
    }

}
