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
                'direccion' => 'Avenida de la Libertad 45, Elda',
                'logo_url' => 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7',
                'email_verified_at' => now()
            ]
        );

        Animal::factory()->count(rand(3, 6))->create([
            'user_id' => $protectoraHuellitas->id,
            'especie_id' => $perro->id,
            'estado' => 'En adopción',
        ]);

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
        // 3. PROTECTORAS VALIDADAS (14 extra, para tener 15 visibles en total)
        // =========================================================================
        for ($i = 1; $i <= 14; $i++) {
            $protectora = User::factory()->protectora()->create([
                'name' => 'Protectora ' . $i,
                'validado' => true, // FORZAMOS A QUE SEAN VISIBLES SÍ O SÍ
            ]);

            Animal::factory()->count(rand(3, 6))->create([
                'user_id' => $protectora->id,
                'especie_id' => $perro->id,
                'estado' => 'En adopción',
            ]);

            Evento::factory()
                ->count(3)
                ->sequence(fn ($sequence) => [
                    'titulo' => 'Evento ' . ($sequence->index + 1),
                    'descripcion' => 'Jornada especial número ' . ($sequence->index + 1) . ' coordinada por ' . $protectora->name . ' para fomentar la adopción en la zona.',
                ])
                ->create([
                    'user_id' => $protectora->id,
                ]);
        }


        // =========================================================================
        // 4. PROTECTORAS PENDIENTES DE VALIDAR (3 para probar el panel de Admin)
        // =========================================================================
        for ($j = 1; $j <= 3; $j++) {
            $protectoraInactiva = User::factory()->protectora()->create([
                'name' => 'Protectora Pendiente ' . $j, // Nombre especial para identificarlas fácil
                'validado' => false, // FORZAMOS A QUE ESTÉN OCULTAS
            ]);

            // Les metemos animales y eventos para que, al validarlas, ya tengan contenido
            Animal::factory()->count(rand(3, 6))->create([
                'user_id' => $protectoraInactiva->id,
                'especie_id' => $perro->id,
                'estado' => 'En adopción',
            ]);

            Evento::factory()
                ->count(3)
                ->sequence(fn ($sequence) => [
                    'titulo' => 'Evento ' . ($sequence->index + 1),
                    'descripcion' => 'Jornada especial número ' . ($sequence->index + 1) . ' coordinada por ' . $protectoraInactiva->name . ' para fomentar la adopción en la zona.',
                ])
                ->create([
                    'user_id' => $protectoraInactiva->id,
                ]);
        }
    }
}