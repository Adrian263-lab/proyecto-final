<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Faker\Factory as FakerFactory;

/**
 * Factory para generar datos de prueba para la entidad User.
 * Utiliza Faker para crear nombres, correos electrónicos y otras características de los usuarios de forma aleatoria,
 * facilitando la creación de registros de usuarios en la base de datos para pruebas y desarrollo.
 * Además, incluye un estado específico para generar protectoras con información adicional como CIF, ubicación y logo.
 */

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        $faker = FakerFactory::create('es_ES');
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
            $faker = FakerFactory::create('es_ES');
            
            $logos = [
                'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7', 
                'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e', 
                'https://images.unsplash.com/photo-1543466835-00a7907e9de1'
            ];

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
            ];

            $ubicacion = $faker->randomElement($ciudades);

            return [
                'name' => 'Protectora ' . $faker->city(),
                'email' => $faker->unique()->companyEmail(),
                'password' => Hash::make('12345678'),
                'rol' => 'protectora',
                'validado' => true, 
                'cif' => $faker->bothify('G########'),
                'latitud' => $ubicacion['lat'] + $faker->randomFloat(4, -0.05, 0.05),
                'longitud' => $ubicacion['lng'] + $faker->randomFloat(4, -0.05, 0.05),
                'direccion' => $faker->streetAddress() . ', ' . $ubicacion['ciudad'],
                'logo_url' => $logos[array_rand($logos)],
                'email_verified_at' => now(),
            ];
        });
    }
}
