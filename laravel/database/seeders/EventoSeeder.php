<?php

namespace Database\Seeders;

use App\Models\Evento;
use App\Models\User;
use Illuminate\Database\Seeder;

class EventoSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Verificamos que existan protectoras antes de intentar crear eventos
        $protectoras = User::where('rol', 'protectora')->get();

        if ($protectoras->isEmpty()) {
            $this->command->warn('No se encontraron protectoras. Saltando creación de eventos.');
            return;
        }

        // 2. Creamos los eventos de forma segura
        Evento::factory()->count(10)->create();
        
        $this->command->info('10 eventos creados correctamente.');
    }
}