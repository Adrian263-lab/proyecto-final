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

    // Estado para crear Protectoras con identidades y fotos 100% FIJAS
    public function protectora(): static
    {
        return $this->state(function (array $attributes) {

            // Usamos un contador estático local para el estado si no existía ya en la clase,
            // o nos apoyamos en un randomizador basado en un ID secuencial predecible.
            // Para asegurar un ID fijo correlativo del 1 al 15:
            static $idProtectora = 0;
            $idProtectora++;

            // Si el contador supera las 15 fotos que tenemos, vuelve a empezar (evita desbordamientos)
            $indice = (($idProtectora - 1) % 15) + 1;

            $logosFijos = [
                1 => 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7', // Cachorros de perro juntos
                2 => 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e', // Perro divertido con gafas
                3 => 'https://images.unsplash.com/photo-1543466835-00a7907e9de1', // Golden Retriever feliz
                4 => 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba', // Gato mirando a cámara
                5 => 'https://images.unsplash.com/photo-1573865526739-10659fec78a5', // Gato atigrado
                6 => 'https://images.unsplash.com/photo-1535268647977-a403b69fc756', // Perro corriendo en la playa
                7 => 'https://images.unsplash.com/photo-1581888227599-779811939961', // Husky siberiano
                8 => 'https://images.unsplash.com/photo-1444212477490-ca407925329e', // Grupo de perros jugando
                9 => 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993', // Gato feliz
                10 => 'https://images.unsplash.com/photo-1552053831-71594a27632d', // Perro labrador tierno
                11 => 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce', // Gato con gafas de sol
                12 => 'https://images.unsplash.com/photo-1587300003388-59208cc962cb', // Perro sonriendo
                13 => 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec', // Gato mirando de frente
                14 => 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b', // Perros corriendo juntos
                15 => 'https://images.unsplash.com/photo-1504595403659-9088ce801e29'  // Cachorro border collie
            ];

            return [
                'name' => "Protectora Albergue " . $indice,
                'email' => "protectora" . $indice . "@test.com",
                'rol' => 'protectora',
                'validado' => true,
                'cif' => "G" . (20000000 + $indice), // CIF fijo correlativo y único
                'logo_url' => $logosFijos[$indice], // Asignación 100% matemática y fija
            ];
        });
    }
}
