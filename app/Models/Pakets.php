<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Pakets extends Model
{
    use HasFactory;

    protected $table = 'pakets';
    protected $fillable = [
        'unique_number',
        'senderofficer_name',
        'sender_name',
        'receiver_name',
        'receiver_phone',
        'package_notes',
        'package_photo',
        'screenshot',
        'pickerofficer_name',
        'picker_name',
        'picker_phone',
        'receiver_photo'

    ];
    }
