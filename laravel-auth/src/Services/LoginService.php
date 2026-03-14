<?php

namespace Fkcode\Auth\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginService
{
    public function attempt(string $email, string $password, Request $request): bool
    {
        if (! Auth::attempt(['email' => $email, 'password' => $password])) {
            return false;
        }

        $request->session()->regenerate();

        return true;
    }

    public function logout(Request $request): void
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();
    }
}
