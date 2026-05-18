<?php

namespace Database\Seeders;

use App\Models\Evento;
use Illuminate\Database\Seeder;

class EventoSeeder extends Seeder
{
    public function run(): void
    {
        // Genera 10 eventos falsos usando la Factory anterior
        Evento::factory()->count(10)->create();
    }
}