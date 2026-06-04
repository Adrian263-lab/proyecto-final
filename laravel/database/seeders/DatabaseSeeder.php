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
        // Bancos de imágenes
        $logos = ['https://images.unsplash.com/photo-1516734212186-a967f81ad0d7', 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e', 'https://images.unsplash.com/photo-1543466835-00a7907e9de1'];
        $fotosAnimales = ['https://images.unsplash.com/photo-1552053831-71594a27632d', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba', 'https://images.unsplash.com/photo-1573865526739-10659fec78a5'];
        $fotosEventos = ['https://images.unsplash.com/photo-1548199973-03cce0bbc87b', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee', 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7'];

        // 1. Admin y Particular
        User::updateOrCreate(['email' => 'admin@test.com'], ['name' => 'Admin Sistema', 'password' => Hash::make('12345678'), 'rol' => 'admin', 'validado' => true]);
        User::updateOrCreate(['email' => 'juan@test.com'], ['name' => 'Juan Particular', 'password' => Hash::make('12345678'), 'rol' => 'particular', 'validado' => true]);

        // 2. Protectora Inicial (Huellitas)
        $protectora1 = User::updateOrCreate(['email' => 'protectora@test.com'], [
            'name' => 'Protectora Huellitas', 'password' => Hash::make('12345678'), 'rol' => 'protectora', 'validado' => true, 'cif' => 'B12345678', 'logo_url' => $logos[0]
        ]);

        $perro = Especie::firstOrCreate(['nombre' => 'Perro']);
        $gato = Especie::firstOrCreate(['nombre' => 'Gato']);

        // Animales y 2 Eventos para Huellitas
        for ($i = 0; $i < 2; $i++) {
            Animal::create(['nombre' => 'Mascota ' . $i, 'especie_id' => $perro->id, 'user_id' => $protectora1->id, 'raza' => 'Común', 'estado' => 'En adopción', 'descripcion' => 'Descripción', 'sexo' => 'Macho', 'imagen_url' => $fotosAnimales[$i % count($fotosAnimales)]]);
        }
        for ($i = 0; $i < 2; $i++) {
            Evento::create(['titulo' => 'Evento ' . $i, 'descripcion' => 'Descripción', 'fecha' => now()->addDays($i), 'user_id' => $protectora1->id, 'ubicacion' => 'Ubicación', 'imagen_url' => $fotosEventos[$i % count($fotosEventos)]]);
        }

        // 3. Protectoras adicionales
        $protectorasExtra = [
            ['name' => 'Protectora Norte', 'email' => 'norte@test.com', 'cif' => 'G10000001', 'lat' => 43.26, 'lon' => -2.93],
            ['name' => 'Protectora Sur', 'email' => 'sur@test.com', 'cif' => 'G20000002', 'lat' => 37.38, 'lon' => -5.98],
            ['name' => 'Protectora Este', 'email' => 'este@test.com', 'cif' => 'G30000003', 'lat' => 39.46, 'lon' => -0.37],
            ['name' => 'Protectora Oeste', 'email' => 'oeste@test.com', 'cif' => 'G40000004', 'lat' => 40.96, 'lon' => -5.66],
            ['name' => 'Protectora Centro', 'email' => 'centro@test.com', 'cif' => 'G50000005', 'lat' => 40.41, 'lon' => -3.70],
        ];

        foreach ($protectorasExtra as $index => $data) {
            $user = User::updateOrCreate(['email' => $data['email']], [
                'name' => $data['name'], 'password' => Hash::make('12345678'), 'rol' => 'protectora', 'validado' => true, 'cif' => $data['cif'], 'logo_url' => $logos[$index % count($logos)], 'latitud' => $data['lat'], 'longitud' => $data['lon']
            ]);

            // 3 Animales
            for ($i = 0; $i < 3; $i++) {
                Animal::create(['nombre' => 'Mascota ' . $i, 'especie_id' => $perro->id, 'user_id' => $user->id, 'raza' => 'Común', 'estado' => 'En adopción', 'descripcion' => 'Descripción', 'sexo' => 'Hembra', 'imagen_url' => $fotosAnimales[($index + $i) % count($fotosAnimales)]]);
            }

            // 2 Eventos fijos
            for ($j = 0; $j < 2; $j++) {
                Evento::create([
                    'titulo' => 'Evento ' . $j, 
                    'descripcion' => 'Descripción', 
                    'fecha' => now()->addDays($j + ($index * 2)), 
                    'user_id' => $user->id, 
                    'ubicacion' => 'Ubicación fija', 
                    'imagen_url' => $fotosEventos[($index + $j) % count($fotosEventos)]
                ]);
            }
        }
    }
}