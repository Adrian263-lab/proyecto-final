<?php

namespace Database\Factories;

use App\Models\Animal;
use Illuminate\Database\Eloquent\Factories\Factory;

class AnimalFactory extends Factory
{
    protected $model = Animal::class;

    // Contador estático para saber qué número de animal estamos creando
    private static $contador = 0;

    public function definition(): array
    {
        self::$contador++;

        // Listas fijas indexadas de datos emparejados para que tengan coherencia visual
        $nombres = [
            1 => 'Thor',       2 => 'Luna',      3 => 'Kira',       4 => 'Coco',       5 => 'Simba',
            6 => 'Max',        7 => 'Bimba',     8 => 'Lola',       9 => 'Rocky',      10 => 'Toby',
            11 => 'Nala',      12 => 'Pepe',     13 => 'Bruno',     14 => 'Mia',       15 => 'Zeus'
        ];

        $razas = [
            1 => 'Pastor Alemán', 2 => 'Común Europeo', 3 => 'Border Collie', 4 => 'Persa',         5 => 'Golden Retriever',
            6 => 'Siamés',        7 => 'Mestizo',       8 => 'Chihuahua',     9 => 'Labrador',      10 => 'Boxer',
            11 => 'Husky',        12 => 'Beagle',       13 => 'Rottweiler',   14 => 'Gato Angora',  15 => 'Pug'
        ];

        // 🐾 POOL 100% PURIFICADO: Solo primeros planos nítidos de perros y gatos
        $imagenes = [
            1 => 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500&auto=format&fit=crop', // Pastor Alemán tumbado
            2 => 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&auto=format&fit=crop', // Gato atigrado mirando fijo
            3 => 'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?w=500&auto=format&fit=crop', // Border Collie en el jardín
            4 => 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=500&auto=format&fit=crop', // Gato persa con gafas de sol
            5 => 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&auto=format&fit=crop', // Perro Golden Retriever sentado
            6 => 'https://images.unsplash.com/photo-1513360356723-81a414a8e917?w=500&auto=format&fit=crop', // Gato Siamés jugando
            7 => 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=500&auto=format&fit=crop', // Perro mestizo bueno mirando de lado
            8 => 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&auto=format&fit=crop', // Dos perritos corriendo felices
            9 => 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&auto=format&fit=crop', // Perro blanco sonriendo
            10 => 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop', // Perro feliz sacando la lengua
            11 => 'https://images.unsplash.com/photo-1531804055935-76f44d7c3621?w=500&auto=format&fit=crop', // Husky siberiano ojiazul
            12 => 'https://images.unsplash.com/photo-1504595403659-9088ce801e29?w=500&auto=format&fit=crop', // Cachorro de Border Collie precioso
            13 => 'https://images.unsplash.com/photo-1554692990-d1488b74f687?w=500&auto=format&fit=crop', // Perro grande marrón en el campo
            14 => 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=500&auto=format&fit=crop', // Gatito pequeño naranja jugando
            15 => 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop'  // Perro carlino mirando a cámara
        ];

        // Usamos el módulo (%) para que rote del 1 al 15 de manera limpia y circular
        $indice = ((self::$contador - 1) % 15) + 1;

        return [
            'nombre' => $nombres[$indice],
            'raza' => $razas[$indice],
            'estado' => 'En adopción',
            'descripcion' => "Este es el perfil oficial de {$nombres[$indice]}, un estupendo {$razas[$indice]} que busca un hogar estable.",
            'imagen_url' => $imagenes[$indice],
        ];
    }
}