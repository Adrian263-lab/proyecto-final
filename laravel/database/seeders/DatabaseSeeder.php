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

        // Secuencia para los eventos de la protectora principal
        Evento::factory()
            ->count(3)
            ->sequence(fn ($sequence) => [
                'titulo' => 'Evento ' . ($sequence->index + 1),
            ])
            ->create([
                'user_id' => $protectoraHuellitas->id,
            ]);


        // =========================================================================
        // 3. GENERACIÓN DINÁMICA CON SECUENCIA (Protectora 1, 2, 3...)
        // =========================================================================
        User::factory()
            ->count(10) 
            ->protectora()
            // Secuencia para los nombres de las protectoras
            ->sequence(fn ($sequence) => [
                'name' => 'Protectora ' . ($sequence->index + 1),
            ])
            ->create()
            ->each(function ($protectora) use ($perro) {
                
                // Animales de cada protectora
                Animal::factory()->count(3)->create([
                    'user_id' => $protectora->id,
                    'especie_id' => $perro->id,
                ]);

                // Secuencia para los eventos de cada protectora dinámica
                Evento::factory()
                    ->count(3)
                    ->sequence(fn ($sequence) => [
                        'titulo' => 'Evento ' . ($sequence->index + 1),
                    ])
                    ->create([
                        'user_id' => $protectora->id,
                    ]);
            });
    }
}