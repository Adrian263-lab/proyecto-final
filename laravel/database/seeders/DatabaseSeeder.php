<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Especie;
use App\Models\Animal;
use App\Models\Evento;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Cuentas fijas para acceso garantizado
        User::updateOrCreate(
            ['email' => 'admin@test.com'], 
            ['name' => 'Admin Sistema', 'password' => Hash::make('12345678'), 'rol' => 'admin', 'validado' => true, 'email_verified_at' => now()]
        );
        
        // Conservamos la cuenta de Juan Particular
        User::updateOrCreate(
            ['email' => 'juan@test.com'], 
            ['name' => 'Juan Particular', 'password' => Hash::make('12345678'), 'rol' => 'particular', 'validado' => true, 'email_verified_at' => now()]
        );

        $perro = Especie::firstOrCreate(['nombre' => 'Perro']);

        // =========================================================================
        // 2. PROTECTORA HUELLITAS (1 de 15)
        // =========================================================================
        $protectoraHuellitas = User::updateOrCreate(
            ['email' => 'protectora@test.com'], 
            [
                'name' => 'Protectora Huellitas', 
                'password' => Hash::make('12345678'), 
                'rol' => 'protectora', 
                'validado' => true, 
                'cif' => 'B12345678', 
                'latitud' => 38.48, 
                'longitud' => -0.79,
                'direccion' => 'Avenida de la Libertad 45, Elda',
                'logo_url' => 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7',
                'email_verified_at' => now()
            ]
        );

        // 3 En adopción y 1 Adoptado para la protectora principal
        Animal::factory()->count(3)->create(['user_id' => $protectoraHuellitas->id, 'especie_id' => $perro->id, 'estado' => 'En adopción']);
        Animal::factory()->count(1)->create(['user_id' => $protectoraHuellitas->id, 'especie_id' => $perro->id, 'estado' => 'Adoptado']);

        // 3 Eventos
        Evento::factory()->count(3)->sequence(fn ($s) => ['titulo' => 'Evento ' . ($s->index + 1)])->create(['user_id' => $protectoraHuellitas->id]);

        // =========================================================================
        // 3. PROTECTORAS DINÁMICAS (14 restantes para hacer las 15)
        // =========================================================================
        for ($i = 1; $i <= 14; $i++) {
            $protectora = User::factory()->protectora()->create([
                'name' => 'Protectora ' . $i,
                'validado' => true,
            ]);

            // 3 En adopción
            Animal::factory()->count(3)->create(['user_id' => $protectora->id, 'especie_id' => $perro->id, 'estado' => 'En adopción']);
            
            // 1 Adoptado
            Animal::factory()->count(1)->create(['user_id' => $protectora->id, 'especie_id' => $perro->id, 'estado' => 'Adoptado']);

            // 3 Eventos
            Evento::factory()->count(3)->sequence(fn ($s) => ['titulo' => 'Evento ' . ($s->index + 1)])->create(['user_id' => $protectora->id]);
        }
    }
}