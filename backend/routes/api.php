<?php


use App\Http\Controllers\AuthController;
use Symfony\Component\Routing\Route;

Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::post('/register', [AuthController::class, 'register']) ->name('register');
