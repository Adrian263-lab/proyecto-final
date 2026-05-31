<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Models\User; 

class UserController extends Controller
{
    /**
     * Listar todos los usuarios (Solo Administradores)
     */
    public function index()
    {
        $usuarioLogueado = Auth::user();

        // 1. Seguridad extra
        if ($usuarioLogueado->rol !== 'admin') {
            return response()->json(['message' => 'No autorizado. Solo administradores.'], 403);
        }

        // 2. Traer todos los usuarios menos a ti mismo, ordenados por los más recientes
        $usuarios = User::where('id', '!=', $usuarioLogueado->id)
                        ->orderBy('created_at', 'desc')
                        ->get();

        return response()->json($usuarios);
    }

    /**
     * Actualizar perfil básico
     */
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

    /**
     * Actualizar logo de la protectora
     */
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

    /**
     * Eliminar un usuario (Solo Administradores)
     * CORREGIDO: Limpieza profunda de relaciones para evitar errores de integridad
     */
    public function destroy($id)
    {
        $usuarioLogueado = Auth::user();

        if ($usuarioLogueado->rol !== 'admin') {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        $userABorrar = User::findOrFail($id);

        if ($userABorrar->id === $usuarioLogueado->id) {
            return response()->json(['message' => 'No puedes borrar tu propia cuenta.'], 400);
        }

        try {
            DB::beginTransaction();

            // 1. Limpiar archivo de logo
            if ($userABorrar->logo_url) {
                $oldPath = str_replace(asset('storage/'), '', $userABorrar->logo_url);
                Storage::disk('public')->delete($oldPath);
            }

            // 2. Limpiar registros relacionados (CRÍTICO para evitar el error de MySQL)
            DB::table('animales')->where('user_id', $id)->delete();
            DB::table('eventos')->where('user_id', $id)->delete();
            DB::table('valoraciones')->where('user_id', $id)->orWhere('protectora_id', $id)->delete();
            DB::table('adopciones')->where('user_id', $id)->delete();
            DB::table('apadrinamientos')->where('user_id', $id)->delete();
            DB::table('admin_notifications')->where('user_id', $id)->delete();

            // 3. Borrar al usuario
            $userABorrar->delete();

            DB::commit();
            return response()->json(['message' => 'Usuario y todos sus datos asociados eliminados correctamente']);
            
        } catch (\Exception $e) {
            DB::rollBack();
            // Esto es lo que te dirá el error real en la consola de React
            return response()->json(['error' => 'Error al borrar: ' . $e->getMessage()], 500);
        }
    }
}
