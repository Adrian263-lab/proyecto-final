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
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
            'remember_token' => Str::random(10),
            'rol' => 'particular',
            'validado' => true,
            'cif' => null,
            'direccion' => "Calle Falsa " . $id,
            'telefono' => "6000000" . $id,
            'logo_url' => 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b',
        ];
    }

    public function protectora(): static
    {
        return $this->state(function (array $attributes) {
            static $idProtectora = 0;
            $idProtectora++;
            $indice = (($idProtectora - 1) % 10) + 1;

            $logosFijos = [
                1  => 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7',
                2  => 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e',
                3  => 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
                4  => 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba',
                5  => 'https://images.unsplash.com/photo-1573865526739-10659fec78a5',
                6  => 'https://images.unsplash.com/photo-1535268647977-a403b69fc756',
                7  => 'https://images.unsplash.com/photo-1581888227599-779811939961',
                8  => 'https://images.unsplash.com/photo-1444212477490-ca407925329e',
                9  => 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993',
                10 => 'https://images.unsplash.com/photo-1552053831-71594a27632d'
            ];

            // Instancia explícita para evitar errores de null
            $faker = \Faker\Factory::create();

            return [
                'name' => "Protectora Albergue " . $indice,
                'email' => "protectora" . $indice . "@test.com",
                'rol' => 'protectora',
                'validado' => true,
                'cif' => "G" . (20000000 + $indice),
                'logo_url' => $logosFijos[$indice],
                'latitud' => $faker->latitude(36.0, 43.8),
                'longitud' => $faker->longitude(-9.0, 3.3),
            ];
        });
    }
}
