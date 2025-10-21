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
        $startDate = Carbon::now()->subDays(7)->startOfDay();
        $endDate = Carbon::now()->endOfDay();

        $interval = 15;
        $totalIntervals = $startDate->diffInMinutes($endDate) / $interval;

        for ($i = 0; $i <= $totalIntervals; $i++) {
            $timestamp = $startDate->copy()->addMinutes($i * $interval);

            MoistureLog::create([
                'moisture_level' => rand(80, 100),
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ]);
        }
    }
}
