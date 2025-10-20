<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MoistureLogController;

Route::group(['prefix' => 'moisture'], function () {
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);

        Route::get('/today', [MoistureLogController::class, 'today']);
        Route::get('/three-days', [MoistureLogController::class, 'threeDays']);
        Route::get('/seven-days', [MoistureLogController::class, 'sevenDays']);
        Route::get('/all-days', [MoistureLogController::class, 'allDays']);
        Route::post('/log', [MoistureLogController::class, 'store']);
    });
});
