<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('protectora_favorita', function (Blueprint $table) {
            $table->id();
            
            // 👤 El usuario particular que añade a favoritos
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade');
            
            // 🏢 La protectora que es añadida como favorita (que también es un ID de la tabla users)
            $table->foreignId('protectora_id')
                  ->constrained('users')
                  ->onDelete('cascade');
                  
            $table->timestamps();

            // 🔒 Opcional: Clave única compuesta para evitar que se duplique el mismo favorito por error en la base de datos
            $table->unique(['user_id', 'protectora_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('protectora_favorita');
    }
};