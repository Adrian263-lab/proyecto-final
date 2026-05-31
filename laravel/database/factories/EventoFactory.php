<?php

namespace Database\Factories;

use App\Models\Evento;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventoFactory extends Factory
{
    protected $model = Evento::class;

    // Contador estático para los eventos dinámicos
    private static $contador = 0;

    public function definition(): array
    {
        self::$contador++;

        $titulos = [
            1 => 'Feria de Adopción Responsable',
            2 => 'Mercadillo Solidario Navideño',
            3 => 'Paseo de Perros Comunitario',
            4 => 'Taller de Educación Canina',
            5 => 'Colecta de Alimentos y Mantas'
        ];

        $ubicaciones = [
            1 => 'Parque Central, Sector Norte',
            2 => 'Plaza Mayor del Ayuntamiento',
            3 => 'Paseo Marítimo Canino',
            4 => 'Centro Cívico Municipal',
            5 => 'Puerta del Supermercado Central'
        ];

        $imagenes = [
            1 => 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&auto=format&fit=crop', // Perros corriendo
            2 => 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=800&auto=format&fit=crop', // Perro feliz jugando
            3 => 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=800&auto=format&fit=crop', // Voluntario con perro
            4 => 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop', // Perro educado con gafas
            5 => 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&auto=format&fit=crop'  // Donaciones de mantas
        ];

        // Hay 5 eventos fijos, por lo que rotarán del 1 al 5 limpiamente
        $indice = ((self::$contador - 1) % 5) + 1;

        return [
            'user_id' => User::factory(), 
            'titulo' => $titulos[$indice],
            'descripcion' => "Acompáñanos en nuestro evento de '{$titulos[$indice]}'. Todo lo recaudado irá destinado íntegramente al mantenimiento del refugio.",
            'fecha' => now()->addDays($indice * 3)->setTime(10, 0, 0), // Fechas correlativas fijas (ej: dentro de 3 días, 6 días, 9 días...)
            'ubicacion' => $ubicaciones[$indice],
            'imagen_url' => $imagenes[$indice],
        ];
    }
}