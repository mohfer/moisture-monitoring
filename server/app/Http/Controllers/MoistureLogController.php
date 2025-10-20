<?php

namespace App\Http\Controllers;

use App\Models\MoistureLog;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class MoistureLogController extends Controller
{
    use ApiResponse;

    public function today()
    {
        $logs = MoistureLog::whereDate('created_at', today())->orderBy('created_at', 'asc')->get();

        $data = [
            'logs' => $logs,
            'stats' => [
                'latest' => $logs->last()?->moisture_level,
                'average' => round($logs->avg('moisture_level'), 1),
                'min' => $logs->min('moisture_level'),
                'max' => $logs->max('moisture_level'),
                'count' => $logs->count()
            ]
        ];

        return $this->sendResponse($data, 'Moisture logs retrieved successfully');
    }

    public function threeDays()
    {
        $logs = MoistureLog::whereDate('created_at', '>=', now()->subDays(3))->orderBy('created_at', 'asc')->get();

        $data = [
            'logs' => $logs,
            'stats' => [
                'latest' => $logs->last()?->moisture_level,
                'average' => round($logs->avg('moisture_level'), 1),
                'min' => $logs->min('moisture_level'),
                'max' => $logs->max('moisture_level'),
                'count' => $logs->count()
            ]
        ];

        return $this->sendResponse($data, 'Moisture logs retrieved successfully');
    }

    public function sevenDays()
    {
        $logs = MoistureLog::whereDate('created_at', '>=', now()->subDays(7))->orderBy('created_at', 'asc')->get();

        $data = [
            'logs' => $logs,
            'stats' => [
                'latest' => $logs->last()?->moisture_level,
                'average' => round($logs->avg('moisture_level'), 1),
                'min' => $logs->min('moisture_level'),
                'max' => $logs->max('moisture_level'),
                'count' => $logs->count()
            ]
        ];

        return $this->sendResponse($data, 'Moisture logs retrieved successfully');
    }

    public function allDays()
    {
        $logs = MoistureLog::orderBy('created_at', 'asc')->get();

        $data = [
            'logs' => $logs,
            'stats' => [
                'latest' => $logs->last()?->moisture_level,
                'average' => round($logs->avg('moisture_level'), 1),
                'min' => $logs->min('moisture_level'),
                'max' => $logs->max('moisture_level'),
                'count' => $logs->count()
            ]
        ];

        return $this->sendResponse($data, 'Moisture logs retrieved successfully');
    }

    public function store(Request $request)
    {
        $request->validate([
            'moisture_level' => 'required|numeric',
        ]);
        MoistureLog::create([
            'moisture_level' => $request->input('moisture_level'),
        ]);
        return $this->sendResponse(null, 'Moisture level logged successfully', 201);
    }
}
