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
        User::updateOrCreate(['email' => 'admin@test.com'], ['name' => 'Admin Sistema', 'password' => Hash::make('12345678'), 'rol' => 'admin', 'validado' => true]);

        // 2. Crear Usuario Particular
        User::updateOrCreate(['email' => 'juan@test.com'], ['name' => 'Juan Particular', 'password' => Hash::make('12345678'), 'rol' => 'particular', 'validado' => true]);

        // 3. Crear Protectora Inicial (Huellitas)
        $protectora1 = User::updateOrCreate(['email' => 'protectora@test.com'], [
            'name' => 'Protectora Huellitas', 
            'password' => Hash::make('12345678'), 
            'rol' => 'protectora', 
            'validado' => true, 
            'cif' => 'B12345678'
        ]);

        $perro = Especie::firstOrCreate(['nombre' => 'Perro']);
        $gato = Especie::firstOrCreate(['nombre' => 'Gato']);

        // Crear 2 animales y 5 eventos para Huellitas (Fijos)
        for ($i = 1; $i <= 2; $i++) {
            Animal::create(['nombre' => 'Mascota Huellitas ' . $i, 'especie_id' => $perro->id, 'user_id' => $protectora1->id, 'raza' => 'Común', 'estado' => 'En adopción', 'descripcion' => 'Descripción fija']);
        }
        for ($i = 1; $i <= 5; $i++) {
            Evento::create(['titulo' => 'Evento Huellitas ' . $i, 'descripcion' => 'Descripción fija', 'fecha' => now(), 'user_id' => $protectora1->id, 'ubicacion' => 'Ubicación fija']);
        }

        // 4. Crear las 5 Protectoras adicionales FIJAS
        $protectorasExtra = [
            ['name' => 'Protectora Norte', 'email' => 'norte@test.com', 'cif' => 'G10000001'],
            ['name' => 'Protectora Sur', 'email' => 'sur@test.com', 'cif' => 'G20000002'],
            ['name' => 'Protectora Este', 'email' => 'este@test.com', 'cif' => 'G30000003'],
            ['name' => 'Protectora Oeste', 'email' => 'oeste@test.com', 'cif' => 'G40000004'],
            ['name' => 'Protectora Centro', 'email' => 'centro@test.com', 'cif' => 'G50000005'],
        ];

        foreach ($protectorasExtra as $data) {
            $user = User::updateOrCreate(['email' => $data['email']], [
                'name' => $data['name'],
                'password' => Hash::make('12345678'),
                'rol' => 'protectora',
                'validado' => true,
                'cif' => $data['cif']
            ]);

            // 3 Animales fijos por protectora
            for ($j = 1; $j <= 3; $j++) {
                Animal::create(['nombre' => 'Animal de ' . $user->name . ' ' . $j, 'especie_id' => $perro->id, 'user_id' => $user->id, 'raza' => 'Raza Fija', 'estado' => 'En adopción', 'descripcion' => 'Descripción fija']);
            }

            // 5 Eventos fijos por protectora
            for ($j = 1; $j <= 5; $j++) {
                Evento::create(['titulo' => 'Evento de ' . $user->name . ' ' . $j, 'descripcion' => 'Descripción fija', 'fecha' => now(), 'user_id' => $user->id, 'ubicacion' => 'Ubicación fija']);
            }
        }
    }
}