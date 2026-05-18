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
        // 0. Crear un Administrador (Imprescindible para el panel)
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
            'telefono' => '600111222'
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

        // 5. Crear Animales asociados
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
            'descripcion' => 'Ven a conocer a nuestros peludos en busca de un hogar estable. Habrá actividades infantiles y mercadillo solidario.',
            'fecha' => now()->addDays(3)->setTime(11, 0, 0),
            'ubicacion' => 'Parque de la Estación',
            'imagen_url' => 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b'
        ]);

        Evento::create([
            'user_id' => $protectora->id,
            'titulo' => 'Colecta de Pienso y Mantas',
            'descripcion' => 'Se acerca el invierno y necesitamos llenar el almacén. Cualquier donación de alimento seco o mantas nos ayuda muchísimo.',
            'fecha' => now()->addDays(10)->setTime(10, 30, 0),
            'ubicacion' => 'Puerta del Supermercado Central',
            'imagen_url' => 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba'
        ]);

        // 7. LLAMADA A LOS SEEDERS ALEATORIOS (Importante el orden)
        $this->call([
            ProtectoraSeeder::class,
            EventoSeeder::class,
        ]);
    }
}