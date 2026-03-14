<?php

namespace Fkcode\Auth\Http\Controllers;

use Fkcode\Auth\Services\LoginService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class LoginController extends Controller
{
    public function __construct(private LoginService $loginService) {}

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (! $this->loginService->attempt($credentials['email'], $credentials['password'], $request)) {
            return response()->json(['message' => 'Invalid credentials'], 422);
        }

        return response()->json(['ok' => true]);
    }

    public function logout(Request $request)
    {
        $this->loginService->logout($request);

        return response()->json(['ok' => true]);
    }

    public function me(Request $request)
    {
        return $request->user();
    }
}
