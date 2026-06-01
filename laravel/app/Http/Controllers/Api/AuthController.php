<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Events\Registered; // 👈 AÑADIDO: Evento nativo para activar el envío de emails

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

        $esProtectora = $request->rol === 'protectora';

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'rol' => $request->rol,
            'cif' => $request->cif,
            'direccion' => $request->direccion,
            'telefono' => $request->telefono,
            // Las protectoras nacen inactivas; los usuarios comunes nacen activos de sistema pero pendientes de email
            'validado' => !$esProtectora,
        ]);

        // 🚀 ESCUDO 1: Control según el tipo de registro
        if (!$esProtectora) {
            // Dispara el sistema nativo de Laravel. Enviará el email de verificación a la bandeja del usuario
            event(new Registered($user));

            return response()->json([
                'message' => 'Registro completado con éxito. Por favor, revisa tu bandeja de entrada y verifica tu correo electrónico para poder acceder.'
            ], 201);
        }

        // Si es una protectora, se va a la cola de revisión del administrador sin token
        return response()->json([
            'message' => 'Solicitud de protectora registrada correctamente. El administrador revisará tu perfil y recibirás una notificación por correo cuando sea aprobada.'
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

        // 🚀 ESCUDO 2: Barrera de verificación por correo para usuarios normales
        if ($user->rol !== 'protectora' && !$user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Debes verificar tu dirección de correo electrónico antes de iniciar sesión.'
            ], 403); // 403 Forbidden
        }

        // 2. Barrera de validación para protectoras (Admin)
        if ($user->rol === 'protectora' && !$user->validado) {
            return response()->json([
                'message' => 'Tu cuenta aún no ha sido validada por un administrador. Recibirás un correo cuando sea activada.'
            ], 403);
        }

        // 3. Login exitoso
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
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }
}