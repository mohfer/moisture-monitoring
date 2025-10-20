<?php

namespace Database\Seeders;

use App\Models\MoistureLog;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class MoistureLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $startDate = Carbon::now()->subDays(7);
        $totalIntervals = (7 * 24 * 60) / 15;

        for ($i = 0; $i <= $totalIntervals; $i++) {
            MoistureLog::create([
                'moisture_level' => rand(80, 100),
                'created_at' => $startDate->copy()->addMinutes($i * 15),
                'updated_at' => $startDate->copy()->addMinutes($i * 15),
            ]);
        }
    }
}
