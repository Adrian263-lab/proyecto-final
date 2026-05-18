<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    private static $contador = 1;

    public function definition(): array
    {
        $id = self::$contador++;

        return [
            'name' => "Usuario Particular " . $id,
            'email' => "particular" . $id . "_" . time() . "@test.com",
            'email_verified_at' => now(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 12345678
            'remember_token' => Str::random(10),
            'rol' => 'particular',
            'validado' => true,
            'cif' => null,
            'direccion' => "Calle Falsa " . $id,
            'telefono' => "6000000" . $id,
        ];
    }

    // Estado para crear Protectoras
    public function protectora(): static
    {
        return $this->state(function (array $attributes) {
            $id = rand(10, 99);
            return [
                'name' => "Protectora Albergue " . $id,
                'email' => "protectora" . $id . "_" . time() . "@test.com",
                'rol' => 'protectora',
                'validado' => true,
                'cif' => "G" . rand(10000000, 99999999),
            ];
        });
    }
}
