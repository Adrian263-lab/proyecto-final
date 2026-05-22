<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('evento_user', function (Blueprint $table) {
            $table->id();
            // Relación con el usuario que se inscribe
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            // Relación con el evento al que se inscribe
            $table->foreignId('evento_id')->constrained('eventos')->onDelete('cascade');
            $table->timestamps();
            
            // Esto asegura que un usuario no pueda inscribirse dos veces al mismo evento
            $table->unique(['user_id', 'evento_id']); 
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evento_user');
    }
};