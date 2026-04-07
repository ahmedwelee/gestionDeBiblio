<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'author_id',
        'category_id',
        'quantity',
        'image',
        'price',
    ];

    public function author()
    {
        return $this->belongsTo(Author::class)->select(['id', 'name']);
    }

    public function category()
    {
        return $this->belongsTo(Category::class)->select(['id', 'name', 'description']);
    }

    public function borrowRecords()
    {
        return $this->hasMany(BorrowRecord::class);
    }
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function getImageUrlAttribute()
    {
        return $this->image ? asset('storage/' . $this->image) : null;
    }
    public function getAvailableCopiesAttribute()
    {
        return $this->quantity - $this->borrowRecords()->whereNull('return_date')->count();
    }
    public function isAvailable()
    {
        return $this->getAvailableCopiesAttribute() > 0;
    }





}
