<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LibrarianController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\BorrowRecordController;
use App\Http\Controllers\RegistrationRequestController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WaitingListController;
use App\Http\Controllers\ChatbotController;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

// Public routes

Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::post('/register', [AuthController::class, 'register']) ->name('register');
Route::post('/register/request', [RegistrationRequestController::class, 'store']) ->name('request.registration');


// Protected routes
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']) ->name('logout');
    Route::put('/user', [UserController::class, 'updateOwnProfile'])->name('user.updateOwn');
    Route::get('/user', [UserController::class, 'user']) ->name('user');
    Route::get('/user/stats', [UserController::class, 'userStats']) ->name('user.stats');
    Route::get('/stats', [UserController::class, 'Stats']) ->name('user.stats');
    Route::put('/user/toggle/{id}', [UserController::class, 'toggleUser']) ->name('user.toggle');
    Route::put('/user/change-password', [UserController::class, 'changePassword']);

    Route::get('/users', [UserController::class, 'index']) ->name('users');
    Route::get('/users/{user}', [UserController::class, 'getUserById']) ->whereNumber('id')->name('user.show');
    Route::delete('/users/{user}', [UserController::class, 'destroy']) ->whereNumber('id')->name('user.destroy');
    Route::put('/users/{user}', [UserController::class, 'update']) ->whereNumber('id')->name('user.update');

    // Registration request routes
    Route::get('/requests', [RegistrationRequestController::class, 'index'])->name('admin.request');
    Route::delete('/request/{request}', [RegistrationRequestController::class, 'reject'])->whereNumber('id')->name('admin.request.destroy');
    Route::post('/request/{request}', [RegistrationRequestController::class, 'approve'])->whereNumber('id')->name('admin.user.approve');

    // Admin-only routes
    Route::middleware('admin')->group(function () {
        Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');

    });

    // Librarian-only routes
    Route::middleware('librarian')->group(function () {
        Route::get('/librarian/dashboard', [LibrarianController::class, 'dashboard'])->name('librarian.dashboard');
    });

    Route::prefix('/authors', 'authors')->controller(AuthorController::class)->name('author') ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/{author}', 'show')->whereNumber('id')->name('show');
        Route::post('/create', 'store')->name('create');
        Route::put('/{author}', 'update')->whereNumber('id')->name('update');
        Route::delete('/{author}', 'destroy')->whereNumber('id')->name('destroy');
    });
});


// Common routes


Route::prefix('/categories', 'categories')->controller(CategoryController::class)->name('category') ->group(function () {
    Route::get('/', 'index')->name('index');
    Route::get('/{category}', 'show')->whereNumber('id')->name('show');
    Route::post('/create', 'store')->name('create');
    Route::put('/{category}', 'update')->whereNumber('id')->name('update');
    Route::delete('/{category}', 'destroy')->whereNumber('id')->name('destroy');
    Route::get('/{category}/books', 'books')->whereNumber('category');
});
Route::prefix('books')->controller(BookController::class)->name('book.')->group(function () {
    Route::get('/', 'index')->name('index');
    Route::get('/{book}', 'show')->whereNumber('book')->name('show');
    Route::post('/create', 'store')->name('create');
    Route::put('/{book}', 'update')->whereNumber('book')->name('update');
    Route::delete('/{book}', 'destroy')->whereNumber('book')->name('destroy');
    Route::get('/search', 'search')->name('search');
    Route::get('/newArrivals', 'newArrivals')->name('newArrivals');
    Route::get('/categories', 'getCategories')->name('categories');
    Route::get('/authors', 'getAuthors')->name('authors');
});


Route::prefix('/reservations')->controller(ReservationController::class)->name('reservation')->group(function () {
    Route::get('/', 'index')->name('index');
    Route::get('/{reservation}', 'show')->whereNumber('id')->name('show');
    Route::post('/create', 'store')->name('create');
    Route::post('/approve/{reservation}', 'approve')->whereNumber('id')->name('approve');
    Route::put('/{reservation}', 'update')->whereNumber('id')->name('update');
    Route::delete('/{reservation}', 'destroy')->whereNumber('id')->name('destroy');
    // for user dashboard
    Route::get('/user/{id}', 'userReservations')->name('user');

});

Route::prefix('borrow-records')->controller(BorrowRecordController::class)->group(function () {
    Route::get('/', 'index');
    Route::get('/{borrowRecord}', 'show');
    Route::post('/create', 'store');
    Route::put('/{borrowRecord}', 'update');
    Route::delete('/{borrowRecord}', 'destroy');
    Route::get('/user/{id}', 'user');
    Route::get('/user/{id}/history', 'userHistory');
    Route::get('/user/{id}/overdue', 'userOverdue');
});

Route::prefix('/waitingList')->controller(WaitingListController::class)->name('waiting_list') ->group(function () {
    Route::get('/', 'index')->name('index');
    Route::post('/create', 'store')->name('create');
    Route::get('/user/{id}', 'user')->whereNumber('id')->name('user');
    Route::delete('/{id}', 'destroy')->whereNumber('id')->name('destroy');
});

// Chatbot routes
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('/chat')->controller(ChatbotController::class)->group(function () {
        Route::post('/message', 'message')->name('chat.message');
        Route::post('/language', 'setLanguage')->name('chat.language');
        Route::get('/context', 'getContext')->name('chat.context');
    });
});












