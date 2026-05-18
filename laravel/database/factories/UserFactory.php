<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Faker\Factory as FakerContainer; // Cargamos el contenedor nativo de Faker por si acaso

class UserFactory extends Factory
{
    public function definition(): array
    {
        // Esto es un truco infalible: si por lo que sea $this->faker es null, lo creamos a mano en español
        $faker = $this->faker ?? FakerContainer::create('es_ES');

        return [
            'name' => $faker->name(),
            'email' => $faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password (12345678)
            'remember_token' => Str::random(10),
            'rol' => 'particular',
            'validado' => true,
            'cif' => null,
            'direccion' => $faker->address(),
            'telefono' => $faker->phoneNumber(),
        ];
    }

    // Estado para crear Protectoras
    public function protectora(): static
    {
        $faker = $this->faker ?? FakerContainer::create('es_ES');

        return $this->state(fn (array $attributes) => [
            'name' => $faker->company() . ' Protectora',
            'rol' => 'protectora',
            'validado' => true,
            'cif' => strtoupper(Str::random(9)),
        ]);
    }
}
