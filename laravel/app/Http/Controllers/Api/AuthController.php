<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // REGISTRO
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'rol' => 'required|in:particular,protectora,adiestrador,admin',
            'cif' => 'required_if:rol,protectora|string|nullable',
            'direccion' => 'required_if:rol,protectora|string|nullable',
            'telefono' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'rol' => $request->rol,
            'cif' => $request->cif,
            'direccion' => $request->direccion,
            'telefono' => $request->telefono,
            // Las protectoras nacen con validado = false, el resto true
            'validado' => ($request->rol !== 'protectora'),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ], 201);
    }

    // LOGIN
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        // 1. Verificar credenciales básicas
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Credenciales incorrectas'], 401);
        }

        // 2. Barrera de validación para protectoras
        if ($user->rol === 'protectora' && !$user->validado) {
            return response()->json([
                'message' => 'Tu cuenta aún no ha sido validada por un administrador. Recibirás un correo cuando sea activada.'
            ], 403); // 403 Forbidden
        }

        // 3. Login exitoso: Opcionalmente borramos tokens antiguos para que solo haya una sesión activa
        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    // LOGOUT
    public function logout(Request $request)
    {
        // Borra el token que se está usando actualmente
        $request->user()->currentAccessToken()->delete();
        
        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }
}