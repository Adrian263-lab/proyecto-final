<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Faker\Factory as FakerFactory;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        $faker = FakerFactory::create();
        return [
            'name' => $faker->name(),
            'email' => $faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => Hash::make('12345678'),
            'remember_token' => Str::random(10),
            'rol' => 'particular',
            'validado' => true,
        ];
    }

    public function protectora(): static
    {
        return $this->state(function (array $attributes) {
            $faker = FakerFactory::create('es_ES'); // Usamos Faker en español
            
            $logos = [
                'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7', 
                'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e', 
                'https://images.unsplash.com/photo-1543466835-00a7907e9de1'
            ];

            // Coordenadas base reales de ciudades españolas
            $ciudades = [
                ['lat' => 40.4168, 'lng' => -3.7038], // Madrid
                ['lat' => 41.3851, 'lng' => 2.1734],  // Barcelona
                ['lat' => 39.4699, 'lng' => -0.3774], // Valencia
                ['lat' => 37.3891, 'lng' => -5.9845], // Sevilla
                ['lat' => 38.3452, 'lng' => -0.4810], // Alicante
                ['lat' => 38.4778, 'lng' => -0.7967], // Elda / Vinalopó
                ['lat' => 43.2627, 'lng' => -2.9253], // Bilbao
                ['lat' => 42.8782, 'lng' => -8.5448], // Santiago de Compostela
                ['lat' => 36.7213, 'lng' => -4.4214], // Málaga
                ['lat' => 41.6488, 'lng' => -0.8891], // Zaragoza
            ];

            // Elegimos una ciudad al azar
            $ubicacion = $faker->randomElement($ciudades);

            return [
                'name' => 'Protectora ' . $faker->city(), // Se sobreescribirá en el seeder
                'email' => $faker->unique()->companyEmail(),
                'password' => \Illuminate\Support\Facades\Hash::make('12345678'),
                'rol' => 'protectora',
                'validado' => $faker->boolean(80), 
                'cif' => $faker->bothify('G########'),
                // Sumamos un offset diminuto (+/- 0.05 grados) para dispersar las marcas
                'latitud' => $ubicacion['lat'] + $faker->randomFloat(4, -0.05, 0.05),
                'longitud' => $ubicacion['lng'] + $faker->randomFloat(4, -0.05, 0.05),
                'logo_url' => $faker->randomElement($logos),
                'email_verified_at' => now(),
            ];
        });
    }
}
