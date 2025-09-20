<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class pengantaran extends Model
{
    use HasFactory;

    protected $table = 'pengantarans';
    protected $fillable =[

        'unique_number',
        'senderofficer_name',
        'sender_name',
        'receiver_name',
        'receiver_phone',
        'package_notes',
        'package_photo',
        'screenshot'
    ];
    public function pengambilan()
    {
        return $this->hasOne(Pengambilan::class, 'unique_number', 'unique_number');
    }

}
