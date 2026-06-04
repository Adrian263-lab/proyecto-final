<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Especie;
use App\Models\Animal;
use App\Models\Evento;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $logos = ['https://images.unsplash.com/photo-1516734212186-a967f81ad0d7', 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e', 'https://images.unsplash.com/photo-1543466835-00a7907e9de1'];
        $fotosAnimales = ['https://images.unsplash.com/photo-1552053831-71594a27632d', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba', 'https://images.unsplash.com/photo-1573865526739-10659fec78a5'];
        $fotosEventos = ['https://images.unsplash.com/photo-1548199973-03cce0bbc87b', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee', 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7'];

        // Admin y Particular con verificación
        User::updateOrCreate(['email' => 'admin@test.com'], ['name' => 'Admin Sistema', 'password' => Hash::make('12345678'), 'rol' => 'admin', 'validado' => true, 'email_verified_at' => now()]);
        User::updateOrCreate(['email' => 'juan@test.com'], ['name' => 'Juan Particular', 'password' => Hash::make('12345678'), 'rol' => 'particular', 'validado' => true, 'email_verified_at' => now()]);

        $perro = Especie::firstOrCreate(['nombre' => 'Perro']);

        $protectoras = [
            ['name' => 'Protectora Huellitas', 'email' => 'protectora@test.com', 'cif' => 'B12345678', 'lat' => 38.48, 'lon' => -0.79],
            ['name' => 'Protectora Norte', 'email' => 'norte@test.com', 'cif' => 'G10000001', 'lat' => 43.26, 'lon' => -2.93],
            ['name' => 'Protectora Sur', 'email' => 'sur@test.com', 'cif' => 'G20000002', 'lat' => 37.38, 'lon' => -5.98],
            ['name' => 'Protectora Este', 'email' => 'este@test.com', 'cif' => 'G30000003', 'lat' => 39.46, 'lon' => -0.37],
            ['name' => 'Protectora Oeste', 'email' => 'oeste@test.com', 'cif' => 'G40000004', 'lat' => 40.96, 'lon' => -5.66],
            ['name' => 'Protectora Centro', 'email' => 'centro@test.com', 'cif' => 'G50000005', 'lat' => 40.41, 'lon' => -3.70],
            ['name' => 'Protectora Levante', 'email' => 'levante@test.com', 'cif' => 'G60000006', 'lat' => 38.34, 'lon' => -0.48],
            ['name' => 'Protectora Poniente', 'email' => 'poniente@test.com', 'cif' => 'G70000007', 'lat' => 36.83, 'lon' => -2.46],
            ['name' => 'Protectora Montaña', 'email' => 'montana@test.com', 'cif' => 'G80000008', 'lat' => 42.81, 'lon' => -1.64],
        ];

        foreach ($protectoras as $index => $data) {
            $user = User::updateOrCreate(['email' => $data['email']], [
                'name' => $data['name'], 
                'password' => Hash::make('12345678'), 
                'rol' => 'protectora', 
                'validado' => true, 
                'cif' => $data['cif'], 
                'logo_url' => $logos[$index % count($logos)], 
                'latitud' => $data['lat'], 
                'longitud' => $data['lon'],
                'email_verified_at' => now() // <--- Verificación añadida aquí
            ]);

            for ($i = 0; $i < 3; $i++) {
                Animal::create(['nombre' => 'Mascota ' . ($i+1), 'especie_id' => $perro->id, 'user_id' => $user->id, 'raza' => 'Común', 'estado' => 'En adopción', 'descripcion' => 'Descripción genérica', 'sexo' => 'Hembra', 'imagen_url' => $fotosAnimales[($index + $i) % count($fotosAnimales)]]);
            }

            for ($j = 0; $j < 3; $j++) {
                Evento::create([
                    'titulo' => 'Evento ' . ($j + 1), 
                    'descripcion' => 'Actividad especial organizada por ' . $data['name'] . ' durante el mes de junio.', 
                    'fecha' => Carbon::create(2026, 6, rand(5, 30)), 
                    'user_id' => $user->id, 
                    'ubicacion' => 'Sede ' . $data['name'], 
                    'imagen_url' => $fotosEventos[($index + $j) % count($fotosEventos)]
                ]);
            }
        }
    }
}