<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PengambilanController;
use App\Http\Controllers\PengantaranController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ExportController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::post('/pengantaran', [PengantaranController::class, 'store'])
     ->name('pengantaran.store');
Route::post('/pengambilan', [PengambilanController::class, 'store'])
     ->name('pengambilan.store');


     Route::get('/dashboard', function () {
         return Inertia::render('Dashboard');
        })->middleware(['auth', 'verified'])->name('dashboard');

        Route::middleware('auth')->group(function () {
            Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
            Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
            Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
            Route::get('/dashboard/count',[DashboardController::class, 'count'])
                ->name('dashboard_count');
            Route::get('/dashboard/index',[DashboardController::class, 'index'])
                ->name('dashboard_index');
           Route::get('/export/excel', [ExportController::class, 'excel']);
           Route::get('/export/pdf', [ExportController::class, 'pdf']);


        });

        require __DIR__.'/auth.php';
