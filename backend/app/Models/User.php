<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */

    const Role_Admin = 'admin';
    const Role_User = 'user';
    const ROLE_LIBRARIAN = 'librarian';


    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'role',
        'gmail',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Check if the user is an admin.
     *
     * @return bool
     */
    public function isAdmin()
    {
        return $this->role === 'Admin';
    }

    public function isUser()
    {
        return $this->role === 'user';
    }

    public function isLibrarian()
    {
        return $this->role === 'librarian';
    }
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
    public function books()
    {
        return $this->hasMany(Book::class);
    }
    public function borrowRecords()
    {
        return $this->hasMany(BorrowRecord::class);
    }
}
