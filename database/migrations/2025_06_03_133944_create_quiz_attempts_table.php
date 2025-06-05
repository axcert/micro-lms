return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quiz_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamp('started_at');
            $table->timestamp('submitted_at')->nullable();
            $table->decimal('score', 5, 2)->nullable();
            $table->decimal('percentage', 5, 2)->nullable();
            $table->json('answers'); // Store all answers
            $table->boolean('is_completed')->default(false);
            $table->timestamps();

            $table->unique(['quiz_id', 'user_id']); // One attempt per user per quiz
            $table->index('quiz_id');
            $table->index('user_id');
            $table->index('is_completed');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_attempts');
    }
};