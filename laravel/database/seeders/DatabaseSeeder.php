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
            'descripcion' => 'Un perro muy juguetón y cariñoso.'
        ]);

        Animal::create([
            'nombre' => 'Misifú',
            'especie_id' => $gato->id,
            'user_id' => $protectora->id,
            'raza' => 'Común europeo',
            'estado' => 'En acogida',
            'descripcion' => 'Gato tranquilo, le gusta dormir al sol.'
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
            // He comentado tus otros seeders para evitar que generen conflictos con las cantidades solicitadas
            // ProtectoraSeeder::class,
            // EventoSeeder::class,
        ]);

        // 7. POBLAMIENTO MASIVO AUTOMÁTICO (15 Protectoras, 150 Animales, 150 Eventos)
        for ($i = 1; $i <= 15; $i++) {
            
            // Creamos cada protectora utilizando el factory con su estado dinámico
            $nuevaProtectora = User::factory()->protectora()->create([
                'name' => "Protectora Albergue " . $i,
                'email' => "protectora" . $i . "@test.com",
            ]);

            // Generamos exactamente 10 animales para ESTA protectora en concreto
            Animal::factory()
                ->count(10)
                ->create([
                    'user_id' => $nuevaProtectora->id,
                    'especie_id' => rand($perro->id, $gato->id), // Usa los IDs reales de tus especies guardadas
                ]);

            // Generamos exactamente 10 eventos para ESTA protectora en concreto
            Evento::factory()
                ->count(10)
                ->create([
                    'user_id' => $nuevaProtectora->id
                ]);
        }
    }
}