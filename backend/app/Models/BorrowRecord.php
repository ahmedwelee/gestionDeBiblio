<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BorrowRecord extends Model
{
    use HasFactory;

    protected $table = 'borrow_records';

    protected $fillable = [
        'id',
        'user_id',
        'book_id',
        'borrow_date',
        'return_date',
        'due_date',

    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function book()
    {
        return $this->belongsTo(Book::class, 'book_id');
    }

    public function reservation()
    {
        return $this->belongsTo(Reservation::class, 'reservation_id');
    }

    public function getStatusAttribute()
    {
        if ($this->return_date) {
            return 'returned';
        } elseif (now()->gt($this->due_date)) {
            return 'overdue';
        } else {
            return 'active';
        }
    }


















}
