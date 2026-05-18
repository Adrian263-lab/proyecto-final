<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\User; // <-- IMPORTANTE: Sin esto falla el save()

class UserController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'name'            => 'sometimes|string|max:255',
            'direccion'       => 'nullable|string|max:255',
            'telefono'        => 'nullable|string|max:20',
            'descripcion'     => 'nullable|string',
            'especialidad'    => 'nullable|string|max:255',
            'zona_geografica' => 'nullable|string|max:255',
        ]);

        $user->update($validated);
        return response()->json(['message' => 'Perfil actualizado', 'user' => $user]);
    }

    public function updateLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = $request->user();

        if ($request->hasFile('logo')) {
            // Borrar logo viejo si existe
            if ($user->logo_url) {
                $oldPath = str_replace(asset('storage/'), '', $user->logo_url);
                Storage::disk('public')->delete($oldPath);
            }

            // Guardar nuevo
            $path = $request->file('logo')->store('logos', 'public');
            $user->logo_url = asset('storage/' . $path);
            $user->save();

            return response()->json([
                'message' => 'Logo actualizado con éxito',
                'user' => $user
            ]);
        }

        return response()->json(['message' => 'No se recibió imagen'], 400);
    }
}
