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
        // 1. Cuentas fijas para acceso
        User::updateOrCreate(
            ['email' => 'admin@test.com'], 
            ['name' => 'Admin Sistema', 'password' => Hash::make('12345678'), 'rol' => 'admin', 'validado' => true, 'email_verified_at' => now()]
        );
        
        User::updateOrCreate(
            ['email' => 'juan@test.com'], 
            ['name' => 'Juan Particular', 'password' => Hash::make('12345678'), 'rol' => 'particular', 'validado' => true, 'email_verified_at' => now()]
        );

        $perro = Especie::firstOrCreate(['nombre' => 'Perro']);

        // Ciudades reales para repartir las chinchetas por el mapa de España
        $ciudades = [
            ['lat' => 40.4168, 'lng' => -3.7038, 'ciudad' => 'Madrid'],
            ['lat' => 41.3851, 'lng' => 2.1734, 'ciudad' => 'Barcelona'],
            ['lat' => 39.4699, 'lng' => -0.3774, 'ciudad' => 'Valencia'],
            ['lat' => 37.3891, 'lng' => -5.9845, 'ciudad' => 'Sevilla'],
            ['lat' => 38.3452, 'lng' => -0.4810, 'ciudad' => 'Alicante'],
            ['lat' => 38.4778, 'lng' => -0.7967, 'ciudad' => 'Elda'],
            ['lat' => 43.2627, 'lng' => -2.9253, 'ciudad' => 'Bilbao'],
            ['lat' => 36.7213, 'lng' => -4.4214, 'ciudad' => 'Málaga'],
            ['lat' => 41.6488, 'lng' => -0.8891, 'ciudad' => 'Zaragoza'],
            ['lat' => 42.8782, 'lng' => -8.5448, 'ciudad' => 'Santiago'],
        ];

        // Fotos variadas para los animales
        $fotosPerros = [
            'https://images.unsplash.com/photo-1552053831-71594a27632d',
            'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba',
            'https://images.unsplash.com/photo-1573865526739-10659fec78a5'
        ];

        // =========================================================================
        // NUEVA LISTA DE LOGOS VARIADOS PARA LAS PROTECTORAS
        // =========================================================================
        $logosProtectoras = [
            'https://images.unsplash.com/photo-1628009368231-7bb7cfcb027f', // Veterinario con perro
            'https://images.unsplash.com/photo-1591871937191-7f5a10efd7a3', // Gato blanco y negro
            'https://images.unsplash.com/photo-1517849845537-4d257902454a', // Perro con gafas (gracioso)
            'https://images.unsplash.com/photo-1533738363-b7f9aef128ce', // Gato cool con gafas
            'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e', // Pug estilo ilustración
            'https://images.unsplash.com/photo-1592194996308-7b43878e84a6', // Gato siamés
            'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7', // El Golden Retriever original
        ];

        // =========================================================================
        // 2. CREACIÓN EXACTA DE 15 PROTECTORAS (100% Manual y Segura)
        // =========================================================================
        for ($i = 1; $i <= 15; $i++) {
            
            // Asignamos una ciudad de la lista de forma rotativa
            $ubi = $ciudades[$i % count($ciudades)];
            
            $nombrePro = ($i === 1) ? 'Protectora Huellitas' : 'Protectora ' . $i;
            $emailPro = ($i === 1) ? 'protectora@test.com' : "protectora{$i}@test.com";

            // SELECCIÓN ALEATORIA DEL LOGO
            $logoAleatorio = $logosProtectoras[array_rand($logosProtectoras)];

            // Creamos la protectora directamente
            $protectora = User::updateOrCreate(
                ['email' => $emailPro],
                [
                    'name' => $nombrePro,
                    'password' => Hash::make('12345678'),
                    'rol' => 'protectora',
                    'validado' => true,
                    'cif' => 'G1234567' . $i,
                    'latitud' => $ubi['lat'] + (rand(-5, 5) / 100), // Pequeña variación
                    'longitud' => $ubi['lng'] + (rand(-5, 5) / 100),
                    'direccion' => 'Avenida Principal ' . $i . ', ' . $ubi['ciudad'],
                    'logo_url' => $logoAleatorio, // <-- AHORA USA LA FOTO ALEATORIA
                    'email_verified_at' => now(),
                ]
            );

            // --- A) CREAR 3 ANIMALES EN ADOPCIÓN ---
            for ($j = 1; $j <= 3; $j++) {
                Animal::create([
                    'user_id' => $protectora->id,
                    'especie_id' => $perro->id,
                    'nombre' => 'Perrito ' . $j,
                    'raza' => 'Mestizo',
                    'estado' => 'En adopción',
                    'descripcion' => 'Un perro estupendo y juguetón esperando una familia que le dé mucho amor.',
                    'sexo' => ($j % 2 == 0) ? 'Hembra' : 'Macho',
                    'imagen_url' => $fotosPerros[array_rand($fotosPerros)],
                ]);
            }

            // --- B) CREAR 1 ANIMAL ADOPTADO ---
            Animal::create([
                'user_id' => $protectora->id,
                'especie_id' => $perro->id,
                'nombre' => 'Lucky',
                'raza' => 'Galgo',
                'estado' => 'Adoptado',
                'descripcion' => 'Este campeón ya ha encontrado su hogar definitivo.',
                'sexo' => 'Macho',
                'imagen_url' => $fotosPerros[0],
            ]);

            // --- C) CREAR 3 EVENTOS ---
            for ($k = 1; $k <= 3; $k++) {
                Evento::create([
                    'user_id' => $protectora->id,
                    'titulo' => 'Evento ' . $k . ' de ' . $protectora->name,
                    'descripcion' => 'Jornada de puertas abiertas para conocer a nuestros animales y fomentar la adopción.',
                    'fecha' => '2026-06-' . str_pad(rand(1, 28), 2, '0', STR_PAD_LEFT) . ' 10:00:00',
                    'ubicacion' => 'Instalaciones de ' . $ubi['ciudad'],
                    'imagen_url' => 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b',
                ]);
            }
        }
    }
}