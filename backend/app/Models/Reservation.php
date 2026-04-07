<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'user_id',
        'book_id',
        'reservation_Date',
        'expiryDate',
        'borrow_days',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function book()
    {
        return $this->belongsTo(Book::class, 'book_id');
    }

    public function bookRecord()
    {
        return $this->hasOne(BorrowRecord::class);
    }

    public function isExpired()
    {
        return now()->gt($this->expiryDate);
    }

    public function getStatusAttribute()
    {
        return $this->isExpired() ? 'expired' : 'active';
    }
    public function getReservationDateAttribute($value)
    {
        return \Carbon\Carbon::parse($value)->format('Y-m-d');
    }
        
    
}
