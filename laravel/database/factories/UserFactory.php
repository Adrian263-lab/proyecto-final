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
            $faker = FakerFactory::create();
            $logos = [
                'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7', 
                'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e', 
                'https://images.unsplash.com/photo-1543466835-00a7907e9de1'
            ];

            return [
                'name' => 'Protectora ' . $faker->city(),
                'email' => $faker->unique()->companyEmail(),
                'password' => Hash::make('12345678'),
                'rol' => 'protectora',
                'validado' => $faker->boolean(80), 
                'cif' => $faker->bothify('G########'),
                'latitud' => $faker->randomFloat(6, 36.0, 43.5), // Rango España
                'longitud' => $faker->randomFloat(6, -9.0, 3.0), // Rango España
                'logo_url' => $faker->randomElement($logos),
                'email_verified_at' => now(),
            ];
        });
    }

    public function admin(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'name' => 'Administrador Huellitas',
                'email' => 'admin@test.com',
                'password' => Hash::make('12345678'),
                'rol' => 'admin',
                'validado' => true,
                'email_verified_at' => now(),
            ];
        });
    }
}
