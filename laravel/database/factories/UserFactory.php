<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password (12345678)
            'remember_token' => Str::random(10),
            'rol' => 'particular',
            'validado' => true,
            'cif' => null,
            'direccion' => fake()->address(),
            'telefono' => fake()->phoneNumber(),
        ];
    }

    // Estado para crear Protectoras
    public function protectora(): static
    {
        return $this->state(fn (array $attributes) => [
            'rol' => 'protectora',
            'validado' => fake()->boolean(80), 
            'cif' => strtoupper(Str::random(9)),
        ]);
    }
}
