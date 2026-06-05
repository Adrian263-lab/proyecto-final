<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User; // 👈 Volvemos a usar tu modelo original
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    // REGISTRO
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => [
                'required',
                'string',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols(),
            ],
            'rol' => 'required|in:particular,protectora,adiestrador,admin',
            'cif' => 'required_if:rol,protectora|string|nullable',
            'direccion' => 'required_if:rol,protectora|string|nullable',
            'telefono' => 'nullable|string',
        ], [
            'email.unique' => 'Este correo electrónico ya está registrado.',
            'password.required' => 'La contraseña es obligatoria.',
            'password' => 'La contraseña debe tener un mínimo de 8 caracteres e incluir al menos una letra mayúscula, una minúscula, un número y un símbolo especial.',
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
            'validado' => !$esProtectora,
        ]);

        // Control según el tipo de registro
        if (!$esProtectora) {
            
            // 🚀 El envío directo del correo que arreglamos
            $user->sendEmailVerificationNotification();

            return response()->json([
                'message' => 'Registro completado con éxito. Por favor, revisa tu bandeja de entrada y verifica tu correo electrónico para poder acceder.'
            ], 201);
        }

        return response()->json([
            'message' => 'Solicitud de protectora registrada correctamente. El administrador revisará tu perfil y, una vez tu solicitud sea aceptada, te llegará un correo de verificación.'
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
            return response()->json(['message' => 'Credenciales incorrectas. Inténtalo de nuevo.'], 401);
        }

        // 🛡️ ESCUDO 1: Barrera de validación para protectoras (Admin)
        if ($user->rol === 'protectora' && !$user->validado) {
            return response()->json([
                'message' => 'Tu cuenta aún no ha sido validada por un administrador. Recibirás un correo cuando sea aprobada.'
            ], 403);
        }

        // 🛡️ ESCUDO 2: Barrera de verificación por correo para TODO EL MUNDO (menos el admin principal)
        if ($user->rol !== 'admin' && !$user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Debes verificar tu dirección de correo electrónico antes de iniciar sesión.'
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