<?php

namespace Database\Seeders;

use App\Models\Evento;
use Illuminate\Database\Seeder;

class EventoSeeder extends Seeder
{
    public function run(): void
    {
        // Crea 10 eventos aleatorios usando su factory
        Evento::factory()->count(10)->create();
    }
}