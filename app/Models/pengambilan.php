<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class pengambilan extends Model
{
    use HasFactory;

    protected $table = 'pengambilans';
    protected $fillable =[
        'pickerofficer_name',
        'unique_number',
        'picker_name',
        'picker_phone',
        'receiver_photo',
        'receiver_name'
    ];
     public function pengantaran()
    {
        return $this->belongsTo(Pengantaran::class, 'unique_number', 'unique_number');
    }

}
