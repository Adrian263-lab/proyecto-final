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
            // Ponemos una foto por defecto por si se crea una protectora a mano y no se le pasa logo_url
            'logo_url' => 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b', 
        ];
    }

    // Estado para crear Protectoras
    public function protectora(): static
    {
        return $this->state(function (array $attributes) {
            $id = rand(10, 99);

            // Lista de imágenes bonitas y variadas de animales para usar como logos/portadas
            $logos = [
                'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7', // Cachorros de perro juntos
                'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e', // Perro divertido con gafas
                'https://images.unsplash.com/photo-1543466835-00a7907e9de1', // Golden Retriever feliz
                'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba', // Gato mirando a cámara
                'https://images.unsplash.com/photo-1573865526739-10659fec78a5', // Gato atigrado
                'https://images.unsplash.com/photo-1535268647977-a403b69fc756', // Perro corriendo en la playa
            ];

            return [
                'name' => "Protectora Albergue " . $id,
                'email' => "protectora" . $id . "_" . time() . "@test.com",
                'rol' => 'protectora',
                'validado' => true,
                'cif' => "G" . rand(10000000, 99999999),
                // Elige una URL aleatoria del array superior de forma nativa en PHP
                'logo_url' => $logos[array_rand($logos)], 
            ];
        });
    }
}
