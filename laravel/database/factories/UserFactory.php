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

    // Estado para crear Protectoras con fotos e identidades únicas
    public function protectora(): static
    {
        return $this->state(function (array $attributes) {
            $id = rand(10, 99);

            // Colección ampliada de imágenes reales de refugios, logos y mascotas
            $logos = [
                'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7', // Cachorros de perro juntos
                'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e', // Perro divertido con gafas
                'https://images.unsplash.com/photo-1543466835-00a7907e9de1', // Golden Retriever feliz
                'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba', // Gato mirando a cámara
                'https://images.unsplash.com/photo-1573865526739-10659fec78a5', // Gato atigrado
                'https://images.unsplash.com/photo-1535268647977-a403b69fc756', // Perro corriendo en la playa
                'https://images.unsplash.com/photo-1581888227599-779811939961', // Husky siberiano en la naturaleza
                'https://images.unsplash.com/photo-1444212477490-ca407925329e', // Grupo de perros jugando
                'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993', // Grito de un gato feliz
                'https://images.unsplash.com/photo-1552053831-71594a27632d', // Perro labrador tierno
                'https://images.unsplash.com/photo-1533738363-b7f9aef128ce', // Gato con gafas de sol
                'https://images.unsplash.com/photo-1587300003388-59208cc962cb', // Perro sonriendo en el parque
                'https://images.unsplash.com/photo-1591561954557-26941169b49e', // Pequeño gatito blanco
                'https://images.unsplash.com/photo-1548199973-03cce0bbc87b', // Perros corriendo juntos
                'https://images.unsplash.com/photo-1504595403659-9088ce801e29', // Cachorro border collie
                'https://images.unsplash.com/photo-1561037404-61cd46aa615b'  // Perro mestizo mirando de lado
            ];

            return [
                'name' => "Protectora Albergue " . $id,
                'email' => "protectora" . $id . "_" . time() . "@test.com",
                'rol' => 'protectora',
                'validado' => true,
                'cif' => "G" . rand(10000000, 99999999),
                // Extrae una foto aleatoria del pool
                'logo_url' => $logos[array_rand($logos)],
            ];
        });
    }
}
