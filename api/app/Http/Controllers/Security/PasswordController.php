<?php
namespace App\Http\Controllers\Security;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Security\ResetsPasswords;

class PasswordController extends Controller
{
    use ResetsPasswords;

    public function __construct()
    {
        $this->broker = 'user';
    }
}
