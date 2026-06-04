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
        // 1. Crear Admin
        User::updateOrCreate(
            ['email' => 'admin@test.com'],
            ['name' => 'Admin Sistema', 'password' => Hash::make('12345678'), 'rol' => 'admin', 'validado' => true, 'email_verified_at' => now()]
        );

        // 2. Crear Usuario Particular
        User::updateOrCreate(
            ['email' => 'juan@test.com'],
            ['name' => 'Juan Particular', 'password' => Hash::make('12345678'), 'rol' => 'particular', 'validado' => true, 'email_verified_at' => now()]
        );

        // 3. Crear Protectora Inicial (Huellitas)
        $protectora = User::updateOrCreate(
            ['email' => 'protectora@test.com'],
            [
                'name' => 'Protectora Huellitas',
                'password' => Hash::make('12345678'),
                'rol' => 'protectora',
                'validado' => true,
                'cif' => 'B12345678',
                'direccion' => 'Calle Canina 123',
                'latitud' => 38.4833,
                'longitud' => -0.7936,
                'email_verified_at' => now()
            ]
        );

        // 4. Asegurar Especies
        $perro = Especie::firstOrCreate(['nombre' => 'Perro']);
        $gato = Especie::firstOrCreate(['nombre' => 'Gato']);

        // 5. Crear Animales y Eventos para la protectora inicial
        Animal::factory()->count(2)->create(['user_id' => $protectora->id, 'especie_id' => $perro->id]);
        Evento::factory()->count(5)->create(['user_id' => $protectora->id]);

        // 6. GENERACIÓN MASIVA: 10 Protectoras adicionales
        for ($i = 1; $i <= 10; $i++) {
            $nuevaProtectora = User::factory()->protectora()->create([
                'email' => "protectora_extra_{$i}@test.com", // Email único para cada una
            ]);

            // Crear 3 animales para cada una
            Animal::factory()->count(3)->create([
                'user_id' => $nuevaProtectora->id,
                'especie_id' => ($i % 2 == 0) ? $perro->id : $gato->id // Alterna perros y gatos
            ]);

            // Crear 5 eventos para cada una
            Evento::factory()->count(5)->create([
                'user_id' => $nuevaProtectora->id
            ]);
        }
    }
}