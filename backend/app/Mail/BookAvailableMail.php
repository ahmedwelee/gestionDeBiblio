<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BookAvailableMail extends Mailable
{
    use Queueable, SerializesModels;

    public $book;
    public $user;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($book, $user)
    {
        $this->book = $book;
        $this->user = $user;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Book Now Available')
                    ->view('emails.book_available')
                    ->with([
                        'book' => $this->book,
                        'user' => $this->user,
                    ]);
    }
}
