<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    /**
     * El modelo asociado al factory.
     */
    protected $model = User::class;

    /**
     * Define el estado por defecto (Usuario Particular).
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => Hash::make('12345678'),
            'remember_token' => Str::random(10),
            'rol' => 'particular',
            'validado' => true,
        ];
    }

    /**
     * ESTADO: Modificador para generar Protectoras de prueba.
     */
    public function protectora(): static
    {
        $logos = [
            'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7', 
            'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e', 
            'https://images.unsplash.com/photo-1543466835-00a7907e9de1'
        ];

        return $this->state(fn (array $attributes) => [
            'name' => 'Protectora ' . fake()->city(),
            'email' => fake()->unique()->companyEmail(),
            'password' => Hash::make('12345678'),
            'rol' => 'protectora',
            'validado' => fake()->boolean(80), 
            'cif' => fake()->bothify('G########'),
            'latitud' => fake()->randomFloat(6, 36.0, 43.0),
            'longitud' => fake()->randomFloat(6, -9.0, 3.0),
            'logo_url' => fake()->randomElement($logos),
            'email_verified_at' => now(),
        ]);
    }
    
    /**
     * ESTADO: Modificador para generar la cuenta de Administrador.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Administrador Huellitas',
            'email' => 'admin@test.com',
            'password' => Hash::make('12345678'),
            'rol' => 'admin',
            'validado' => true,
            'email_verified_at' => now(),
        ]);
    }

    /**
     * Indica que el correo no está verificado (opcional para pruebas).
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
