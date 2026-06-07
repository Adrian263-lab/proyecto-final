<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Especie;
use App\Models\Animal;
use App\Models\Evento;
use App\Models\Valoracion; // 🚀 Importamos el modelo de Valoraciones
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // =========================================================================
        // 1. CUENTAS FIJAS Y USUARIOS DE PRUEBA
        // =========================================================================
        User::updateOrCreate(
            ['email' => 'admin@test.com'], 
            ['name' => 'Admin Sistema', 'password' => Hash::make('12345678'), 'rol' => 'admin', 'validado' => true, 'email_verified_at' => now()]
        );
        
        $juan = User::updateOrCreate(
            ['email' => 'juan@test.com'], 
            ['name' => 'Juan Particular', 'password' => Hash::make('12345678'), 'rol' => 'particular', 'validado' => true, 'email_verified_at' => now()]
        );

        // Creamos 5 adoptantes extra para que las valoraciones tengan distintos autores
        $usuariosParticulares = [$juan];
        for ($u = 1; $u <= 5; $u++) {
            $usuariosParticulares[] = User::firstOrCreate(
                ['email' => "adoptante{$u}@test.com"],
                ['name' => 'Usuario Adoptante ' . $u, 'password' => Hash::make('12345678'), 'rol' => 'particular', 'validado' => true, 'email_verified_at' => now()]
            );
        }

        // =========================================================================
        // 2. CATÁLOGO DE ESPECIES
        // =========================================================================
        $nombresEspecies = ['Perro', 'Gato', 'Conejo', 'Roedor', 'Ave', 'Reptil', 'Equino'];
        foreach ($nombresEspecies as $nombre) {
            Especie::firstOrCreate(['nombre' => $nombre]);
        }
        $perro = Especie::where('nombre', 'Perro')->first();

        // =========================================================================
        // 3. DATOS PREPARADOS PARA LAS PROTECTORAS
        // =========================================================================
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

        $fotosPerros = [
            'https://images.unsplash.com/photo-1552053831-71594a27632d',
            'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba',
            'https://images.unsplash.com/photo-1573865526739-10659fec78a5'
        ];

        $logosProtectoras = [
            'https://images.unsplash.com/photo-1628009368231-7bb7cfcb027f', 
            'https://images.unsplash.com/photo-1591871937191-7f5a10efd7a3', 
            'https://images.unsplash.com/photo-1517849845537-4d257902454a', 
            'https://images.unsplash.com/photo-1533738363-b7f9aef128ce', 
            'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e', 
            'https://images.unsplash.com/photo-1592194996308-7b43878e84a6', 
            'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7', 
        ];

        $comentariosPositivos = [
            '¡Gente maravillosa! El trato ha sido excelente y nos han ayudado mucho en todo el proceso.',
            'Muy amables, se nota que se preocupan de verdad por el bienestar de los animales.',
            'El proceso de adopción fue rápido y transparente. Estamos muy felices con nuestro nuevo compañero.',
            'Hacen una labor increíble. Las instalaciones están súper limpias y los animales muy bien cuidados.',
            'Nos asesoraron perfectamente sobre qué perrito encajaba mejor con nuestro estilo de vida y familia.',
            'Gran equipo humano. Nuestro pequeño llegó a casa sano, feliz y con todas sus vacunas al día.'
        ];

        // =========================================================================
        // 4. CREACIÓN EXACTA DE 15 PROTECTORAS
        // =========================================================================
        for ($i = 1; $i <= 15; $i++) {
            $ubi = $ciudades[$i % count($ciudades)];
            $nombrePro = ($i === 1) ? 'Protectora Huellitas' : 'Protectora ' . $i;
            $emailPro = ($i === 1) ? 'protectora@test.com' : "protectora{$i}@test.com";

            $protectora = User::updateOrCreate(
                ['email' => $emailPro],
                [
                    'name' => $nombrePro,
                    'password' => Hash::make('12345678'),
                    'rol' => 'protectora',
                    'validado' => true,
                    'cif' => 'G1234567' . $i,
                    'latitud' => $ubi['lat'] + (rand(-5, 5) / 100),
                    'longitud' => $ubi['lng'] + (rand(-5, 5) / 100),
                    'direccion' => 'Avenida Principal ' . $i . ', ' . $ubi['ciudad'],
                    'logo_url' => $logosProtectoras[array_rand($logosProtectoras)],
                    'descripcion' => 'Somos una pequeña pero apasionada protectora dedicada al rescate, rehabilitación y búsqueda de familias responsables para animales en situación de abandono. ¡Ayúdanos a cambiar sus vidas!',
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

            // --- D) 🚀 CREAR VALORACIONES ALEATORIAS ---
            // Mezclamos los usuarios para que no comenten siempre los mismos
            shuffle($usuariosParticulares); 
            $numValoraciones = rand(1, 3); // Cada protectora tendrá entre 1 y 3 opiniones

            for ($v = 0; $v < $numValoraciones; $v++) {
                Valoracion::create([
                    'protectora_id' => $protectora->id,
                    'user_id' => $usuariosParticulares[$v]->id, // Asignamos el comentario a un usuario aleatorio
                    'puntuacion' => rand(4, 5), // Notas positivas (4 o 5 estrellas)
                    'comentario' => $comentariosPositivos[array_rand($comentariosPositivos)],
                ]);
            }
        }
    }
}