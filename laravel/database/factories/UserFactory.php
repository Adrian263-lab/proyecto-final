<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    public function definition(): array
    {
        // Esta propiedad viene precargada por el propio Framework al extender 'Factory'
        // Es la forma más segura y compatible en cualquier entorno de Laravel
        $faker = $this->faker;

        return [
            'name' => $faker->name,
            'email' => $faker->unique()->safeEmail,
            'email_verified_at' => now(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password (12345678)
            'remember_token' => Str::random(10),
            'rol' => 'particular',
            'validado' => true,
            'cif' => null,
            'direccion' => $faker->address,
            'telefono' => $faker->phoneNumber,
        ];
    }

    // Estado para crear Protectoras
    public function protectora(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => $this->faker->company . ' Protectora',
            'rol' => 'protectora',
            'validado' => true,
            'cif' => strtoupper(Str::random(9)),
        ]);
    }
}
