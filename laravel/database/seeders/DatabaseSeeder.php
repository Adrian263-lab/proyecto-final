<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Especie;
use App\Models\Animal;
use App\Models\Evento;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 0. Crear un Administrador
        User::create([
            'name' => 'Admin Sistema',
            'email' => 'admin@test.com',
            'password' => Hash::make('12345678'),
            'rol' => 'admin',
            'validado' => true
        ]);

        // 1. Crear Especies
        $perro = Especie::create(['nombre' => 'Perro']);
        $gato = Especie::create(['nombre' => 'Gato']);

        // 2. Crear una Protectora VALIDADA fija
        $protectora = User::create([
            'name' => 'Protectora Huellitas',
            'email' => 'admin@huellitas.org',
            'password' => Hash::make('12345678'),
            'rol' => 'protectora',
            'validado' => true,
            'cif' => 'B12345678',
            'direccion' => 'Calle Canina 123',
            'telefono' => '600111222',
            'logo_url' => 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1'
        ]);

        // 3. Crear un Adiestrador fijo
        User::create([
            'name' => 'César Millán',
            'email' => 'cesar@expert.com',
            'password' => Hash::make('12345678'),
            'rol' => 'adiestrador',
            'validado' => true,
            'especialidad' => 'Conducta agresiva',
            'zona_geografica' => 'Madrid y alrededores'
        ]);

        // 4. Crear un Usuario Particular fijo
        User::create([
            'name' => 'Juan Particular',
            'email' => 'juan@gmail.com',
            'password' => Hash::make('12345678'),
            'rol' => 'particular',
            'validado' => true
        ]);

        // 5. Crear Animales asociados fijos
        Animal::create([
            'nombre' => 'Bobby',
            'especie_id' => $perro->id,
            'user_id' => $protectora->id,
            'raza' => 'Golden Retriever',
            'estado' => 'En adopción',
            'descripcion' => 'Un perro muy juguetón y cariñoso.',
            // AÑADIDO: Foto real para Bobby
            'imagen_url' => 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&auto=format&fit=crop'
        ]);

        Animal::create([
            'nombre' => 'Misifú',
            'especie_id' => $gato->id,
            'user_id' => $protectora->id,
            'raza' => 'Común europeo',
            'estado' => 'En acogida',
            'descripcion' => 'Gato tranquilo, le gusta dormir al sol.',
            // AÑADIDO: Foto real para Misifú
            'imagen_url' => 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&auto=format&fit=crop'
        ]);

        // 6. EVENTOS FIJOS (Asociados a la protectora fija)
        Evento::create([
            'user_id' => $protectora->id,
            'titulo' => 'Pasarela de Adopción Huellitas',
            'descripcion' => 'Ven a conocer a nuestros peludos en busca de un hogar estable.',
            'fecha' => now()->addDays(3),
            'ubicacion' => 'Parque de la Estación',
            'imagen_url' => 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b'
        ]);

        $this->call([
            // Seeders secundarios desactivados para delegar todo el volumen al bucle maestro
        ]);

        // Pool de fotos exclusivas para las 15 protectoras dinámicas (evita imágenes repetidas)
        $fotosSecuenciales = [
            1 => 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7',
            2 => 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e',
            3 => 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
            4 => 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba',
            5 => 'https://images.unsplash.com/photo-1573865526739-10659fec78a5',
            6 => 'https://images.unsplash.com/photo-1535268647977-a403b69fc756',
            7 => 'https://images.unsplash.com/photo-1581888227599-779811939961',
            8 => 'https://images.unsplash.com/photo-1444212477490-ca407925329e',
            9 => 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993',
            10 => 'https://images.unsplash.com/photo-1552053831-71594a27632d',
            11 => 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce',
            12 => 'https://images.unsplash.com/photo-1587300003388-59208cc962cb',
            13 => 'https://images.unsplash.com/photo-1591561954557-26941169b49e',
            14 => 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b',
            15 => 'https://images.unsplash.com/photo-1504595403659-9088ce801e29'
        ];

        // 7. POBLAMIENTO MASIVO AUTOMÁTICO (15 Protectoras, 150 Animales, 150 Eventos)
        for ($i = 1; $i <= 15; $i++) {

            // Creamos cada protectora inyectando secuencialmente el nombre, email y su imagen única
            $nuevaProtectora = User::factory()->protectora()->create([
                'name' => "Protectora Albergue " . $i,
                'email' => "protectora" . $i . "@test.com",
                'logo_url' => $fotosSecuenciales[$i]
            ]);

            // Generamos exactamente 10 animales asignados a esta protectora
            Animal::factory()
                ->count(10)
                ->create([
                    'user_id' => $nuevaProtectora->id,
                    'especie_id' => rand($perro->id, $gato->id),
                ]);

            // Generamos exactamente 10 eventos asignados a esta protectora
            Evento::factory()
                ->count(10)
                ->create([
                    'user_id' => $nuevaProtectora->id
                ]);
        }
    }
}