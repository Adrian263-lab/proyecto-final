<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Especie;
use App\Models\Animal;
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
            'validado' => true // Importante
        ]);

        // 1. Crear Especies
        $perro = Especie::create(['nombre' => 'Perro']);
        $gato = Especie::create(['nombre' => 'Gato']);

        // 2. Crear una Protectora VALIDADA (Para que salga en la Home)
        $protectora = User::create([
            'name' => 'Protectora Huellitas',
            'email' => 'admin@huellitas.org',
            'password' => Hash::make('12345678'),
            'rol' => 'protectora',
            'validado' => true, // SI NO PONES TRUE, NO SALDRÁ EN REACT
            'cif' => 'B12345678',
            'direccion' => 'Calle Canina 123',
            'telefono' => '600111222'
        ]);

        // 3. Crear un Adiestrador
        User::create([
            'name' => 'César Millán',
            'email' => 'cesar@expert.com',
            'password' => Hash::make('12345678'),
            'rol' => 'adiestrador',
            'validado' => true,
            'especialidad' => 'Conducta agresiva',
            'zona_geografica' => 'Madrid y alrededores'
        ]);

        // 4. Crear un Usuario Particular
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
    }
}