<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password (12345678)
            'remember_token' => Str::random(10),
            'rol' => 'particular',
            'validado' => true,
            'cif' => null,
            'direccion' => $this->faker->address(),
            'telefono' => $this->faker->phoneNumber(),
        ];
    }

    // Estado para crear Protectoras
    public function protectora(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => $this->faker->company() . ' Protectora', // Le añadimos nombre de empresa para que quede mejor en la Home
            'rol' => 'protectora',
            'validado' => true, // Lo fijamos en true para que salgan todas directamente en tu React sin ser ignoradas
            'cif' => strtoupper(Str::random(9)),
        ]);
    }
}
