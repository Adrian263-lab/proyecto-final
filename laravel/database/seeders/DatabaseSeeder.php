<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Especie;
use App\Models\Animal;
use App\Models\Evento;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Cuentas fijas para acceso garantizado
        User::updateOrCreate(
            ['email' => 'admin@test.com'], 
            ['name' => 'Admin Sistema', 'password' => Hash::make('12345678'), 'rol' => 'admin', 'validado' => true, 'email_verified_at' => now()]
        );
        
        User::updateOrCreate(
            ['email' => 'juan@test.com'], 
            ['name' => 'Juan Particular', 'password' => Hash::make('12345678'), 'rol' => 'particular', 'validado' => true, 'email_verified_at' => now()]
        );

        $perro = Especie::firstOrCreate(['nombre' => 'Perro']);

        // =========================================================================
        // 2. PROTECTORA ESTÁTICA PRINCIPAL ("Protectora Huellitas")
        // =========================================================================
        $protectoraHuellitas = User::updateOrCreate(
            ['email' => 'protectora@test.com'], 
            [
                'name' => 'Protectora Huellitas', 
                'password' => Hash::make('12345678'), 
                'rol' => 'protectora', 
                'validado' => true, 
                'cif' => 'B12345678', 
                'latitud' => 38.48, 
                'longitud' => -0.79,
                'logo_url' => 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7',
                'email_verified_at' => now()
            ]
        );

        Animal::factory()->count(3)->create([
            'user_id' => $protectoraHuellitas->id,
            'especie_id' => $perro->id,
        ]);

        // Eventos ordenados para la protectora estática
        Evento::factory()
            ->count(3)
            ->sequence(fn ($sequence) => [
                'titulo' => 'Evento ' . ($sequence->index + 1),
                'descripcion' => 'Actividad benéfica número ' . ($sequence->index + 1) . ' organizada por Protectora Huellitas para el apoyo y cuidado de nuestros animales.',
            ])
            ->create([
                'user_id' => $protectoraHuellitas->id,
            ]);


        // =========================================================================
        // 3. GENERACIÓN DINÁMICA CON SECUENCIA (15 Protectoras)
        // =========================================================================
        User::factory()
            ->count(15) 
            ->protectora()
            ->sequence(fn ($sequence) => [
                'name' => 'Protectora ' . ($sequence->index + 1),
            ])
            ->create()
            ->each(function ($protectora) use ($perro) {
                
                // Animales vinculados
                Animal::factory()->count(3)->create([
                    'user_id' => $protectora->id,
                    'especie_id' => $perro->id,
                ]);

                // Eventos con títulos y descripciones secuenciales en español
                Evento::factory()
                    ->count(3)
                    ->sequence(fn ($sequence) => [
                        'titulo' => 'Evento ' . ($sequence->index + 1),
                        'descripcion' => 'Jornada especial número ' . ($sequence->index + 1) . ' coordinada por ' . $protectora->name . ' para fomentar la adopción en la zona.',
                    ])
                    ->create([
                        'user_id' => $protectora->id,
                    ]);
            });
    }
}