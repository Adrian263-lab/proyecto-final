<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * Factoría para la generación automatizada de registros de prueba del modelo User.
 * Proporciona un estado base para usuarios particulares y estados condicionales para entidades protectoras.
 */
class UserFactory extends Factory
{
    /**
     * Contador estático secuencial para la asignación de identificadores unívocos en nombres y correos de particulares.
     * @var int
     */
    private static $contador = 1;

    /**
     * Define el estado por defecto del modelo para un usuario con rol de particular.
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $id = self::$contador++;

        return [
            'name' => "Usuario Particular " . $id,
            'email' => "particular" . $id . "_" . time() . "@test.com",
            'email_verified_at' => now(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // Representa el hash de la cadena '12345678'
            'remember_token' => Str::random(10),
            'rol' => 'particular',
            'validado' => true,
            'cif' => null,
            'direccion' => "Calle Falsa " . $id,
            'telefono' => "6000000" . $id,
            'logo_url' => 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b',
        ];
    }

    /**
     * Define un estado condicional para la mutación de atributos y creación de entidades Protectoras.
     * Garantiza la persistencia de identidades, credenciales y URL de recursos multimedia fijos y correlativos.
     * @return static
     */
    public function protectora(): static
    {
        return $this->state(function (array $attributes) {
            /**
             * Inicialización del contador secuencial interno para el control del índice de protectoras.
             */
            static $idProtectora = 0;
            $idProtectora++;

            /**
             * Ajuste aritmético modular restrictivo basado en un volumen optimizado de 10 registros máximos.
             * Previene desbordamientos de índice al mapear las claves del diccionario de recursos.
             */
            $indice = (($idProtectora - 1) % 10) + 1;

            /**
             * Diccionario estructurado de URL estáticas procedentes de Unsplash para la asignación homogénea de logotipos.
             * @var array<int, string>
             */
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

            return [
                'name' => "Protectora Albergue " . $indice,
                'email' => "protectora" . $indice . "@test.com",
                'rol' => 'protectora',
                'validado' => true,
                'cif' => "G" . (20000000 + $indice), 
                'logo_url' => $logosFijos[$indice], 
                
                // 📍 NUEVO: Coordenadas geográficas aleatorias dentro de los límites de España
                'latitud' => fake()->latitude(36.0, 43.8),
                'longitud' => fake()->longitude(-9.0, 3.3),
            ];
        });
    }
}
