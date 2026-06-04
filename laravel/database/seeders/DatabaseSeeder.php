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
        User::create(['name' => 'Admin Sistema', 'email' => 'admin@test.com', 'password' => Hash::make('12345678'), 'rol' => 'admin', 'validado' => true, 'email_verified_at' => now()]);

        $perro = Especie::create(['nombre' => 'Perro']);
        $gato = Especie::create(['nombre' => 'Gato']);

        $protectora = User::create([
            'name' => 'Protectora Huellitas', 'email' => 'admin@huellitas.org', 'password' => Hash::make('12345678'), 'rol' => 'protectora', 'validado' => true, 'cif' => 'B12345678', 'direccion' => 'Calle Canina 123', 'telefono' => '600111222', 'latitud' => 38.4833, 'longitud' => -0.7936, 'logo_url' => 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1', 'email_verified_at' => now(),
        ]);

        User::create(['name' => 'César Millán', 'email' => 'cesar@expert.com', 'password' => Hash::make('12345678'), 'rol' => 'adiestrador', 'validado' => true, 'especialidad' => 'Conducta agresiva', 'zona_geografica' => 'Madrid y alrededores', 'email_verified_at' => now()]);
        User::create(['name' => 'Juan Particular', 'email' => 'juan@gmail.com', 'password' => Hash::make('12345678'), 'rol' => 'particular', 'validado' => true, 'email_verified_at' => now()]);

        Animal::create(['nombre' => 'Bobby', 'especie_id' => $perro->id, 'user_id' => $protectora->id, 'raza' => 'Golden Retriever', 'estado' => 'En adopción', 'descripcion' => 'Un perro muy juguetón.', 'imagen_url' => 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500']);
        Animal::create(['nombre' => 'Misifú', 'especie_id' => $gato->id, 'user_id' => $protectora->id, 'raza' => 'Común europeo', 'estado' => 'En acogida', 'descripcion' => 'Gato tranquilo.', 'imagen_url' => 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500']);

        Evento::create(['user_id' => $protectora->id, 'titulo' => 'Pasarela de Adopción', 'descripcion' => 'Ven a conocer a nuestros peludos', 'fecha' => now()->addDays(3), 'ubicacion' => 'Parque de la Estación', 'imagen_url' => 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800']);
        Evento::create(['user_id' => $protectora->id, 'titulo' => 'Colecta de Pienso', 'descripcion' => 'Donaciones', 'fecha' => now()->addDays(10), 'ubicacion' => 'Supermercado', 'imagen_url' => 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800']);

        $fotosSecuenciales = [1 => 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7', 2 => 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e', 3 => 'https://images.unsplash.com/photo-1543466835-00a7907e9de1', 4 => 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba', 5 => 'https://images.unsplash.com/photo-1573865526739-10659fec78a5', 6 => 'https://images.unsplash.com/photo-1535268647977-a403b69fc756', 7 => 'https://images.unsplash.com/photo-1581888227599-779811939961', 8 => 'https://images.unsplash.com/photo-1444212477490-ca407925329e', 9 => 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993', 10 => 'https://images.unsplash.com/photo-1552053831-71594a27632d'];

        for ($i = 1; $i <= 10; $i++) {
            $nuevaProtectora = User::factory()->protectora()->create([
                'name' => "Protectora Albergue " . $i,
                'email' => "protectora" . $i . "@test.com",
                'logo_url' => $fotosSecuenciales[$i],
                'email_verified_at' => now(), 
            ]);

            Animal::factory()->count(5)->create(['user_id' => $nuevaProtectora->id, 'especie_id' => rand($perro->id, $gato->id)]);
            Evento::factory()->count(5)->create(['user_id' => $nuevaProtectora->id]);
        }
    }
}