<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Especie;
use App\Models\Animal;
use App\Models\Evento;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon; // Asegúrate de añadir esta importación

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $logos = ['https://images.unsplash.com/photo-1516734212186-a967f81ad0d7', 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e', 'https://images.unsplash.com/photo-1543466835-00a7907e9de1'];
        $fotosAnimales = ['https://images.unsplash.com/photo-1552053831-71594a27632d', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba', 'https://images.unsplash.com/photo-1573865526739-10659fec78a5'];
        $fotosEventos = ['https://images.unsplash.com/photo-1548199973-03cce0bbc87b', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee', 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7'];

        // 1. Admin y Particular
        User::updateOrCreate(['email' => 'admin@test.com'], ['name' => 'Admin Sistema', 'password' => Hash::make('12345678'), 'rol' => 'admin', 'validado' => true]);
        User::updateOrCreate(['email' => 'juan@test.com'], ['name' => 'Juan Particular', 'password' => Hash::make('12345678'), 'rol' => 'particular', 'validado' => true]);

        // 2. Protectora Huellitas
        $protectora1 = User::updateOrCreate(['email' => 'protectora@test.com'], [
            'name' => 'Protectora Huellitas', 'password' => Hash::make('12345678'), 'rol' => 'protectora', 'validado' => true, 'cif' => 'B12345678', 'logo_url' => $logos[0]
        ]);

        $perro = Especie::firstOrCreate(['nombre' => 'Perro']);

        // Eventos Huellitas en Julio
        for ($i = 0; $i < 2; $i++) {
            Evento::create([
                'titulo' => 'Evento Huellitas ' . ($i + 1), 
                'descripcion' => 'Jornada de adopción especial en Huellitas durante el mes de julio.', 
                'fecha' => Carbon::create(2026, 7, rand(1, 31)), 
                'user_id' => $protectora1->id, 
                'ubicacion' => 'Sede Central', 
                'imagen_url' => $fotosEventos[$i % count($fotosEventos)]
            ]);
        }

        // 3. Protectoras adicionales
        $protectorasExtra = [
            ['name' => 'Protectora Norte', 'email' => 'norte@test.com', 'cif' => 'G10000001', 'lat' => 43.26, 'lon' => -2.93],
            ['name' => 'Protectora Sur', 'email' => 'sur@test.com', 'cif' => 'G20000002', 'lat' => 37.38, 'lon' => -5.98],
            ['name' => 'Protectora Este', 'email' => 'este@test.com', 'cif' => 'G30000003', 'lat' => 39.46, 'lon' => -0.37],
        ];

        foreach ($protectorasExtra as $index => $data) {
            $user = User::updateOrCreate(['email' => $data['email']], [
                'name' => $data['name'], 'password' => Hash::make('12345678'), 'rol' => 'protectora', 'validado' => true, 'cif' => $data['cif'], 'logo_url' => $logos[$index % count($logos)], 'latitud' => $data['lat'], 'longitud' => $data['lon']
            ]);

            // Animales
            for ($i = 0; $i < 3; $i++) {
                Animal::create(['nombre' => 'Mascota ' . $i, 'especie_id' => $perro->id, 'user_id' => $user->id, 'raza' => 'Común', 'estado' => 'En adopción', 'descripcion' => 'Descripción', 'sexo' => 'Hembra', 'imagen_url' => $fotosAnimales[($index + $i) % count($fotosAnimales)]]);
            }

            // 2 Eventos en Julio con descripción personalizada
            for ($j = 0; $j < 2; $j++) {
                Evento::create([
                    'titulo' => 'Evento ' . $data['name'] . ' ' . ($j + 1), 
                    'descripcion' => 'Actividad recreativa al aire libre organizada por ' . $data['name'] . ' durante el mes de julio.', 
                    'fecha' => Carbon::create(2026, 7, rand(1, 31)), 
                    'user_id' => $user->id, 
                    'ubicacion' => 'Recinto local', 
                    'imagen_url' => $fotosEventos[($index + $j) % count($fotosEventos)]
                ]);
            }
        }
    }
}