<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\BorrowRecord;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReservationController extends Controller
{
    public function index()
    {
        $reservations = Reservation::with('user', 'book')->get();
        return response()->json($reservations);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer',
            'book_id' => 'required|integer',
            'reservation_Date' => 'required|date',
            'expiryDate' => 'required|date',
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator);
        }
        $book = Book::find($request->book_id);
        if (!$book) {
            return response()->json(['message' => 'Book not found'], 404);
        }
        if ($book->quantity <= 0) {
            return response()->json(['message' => 'The book is currently out of stock'], 422);
        }
        $reservation = Reservation::create([
            'user_id' => $request->user_id,
            'book_id' => $request->book_id,
            'reservation_Date' => $request->reservation_Date,
            'expiryDate' => $request->expiryDate,
            'borrow_days' => (new \DateTime($request->expiryDate))->diff(new \DateTime($request->reservation_Date))->days,
         
        ]);
        $book->decrement('quantity');
        return response()->json([
            'message' => 'Reservation created successfully',
            'reservation' => $reservation
        ]);
    }

    public function show(Reservation $reservation)
    {
        if (!$reservation) {
            return response()->json(['message' => 'Reservation not found'], 404);
        }
        return response()->json($reservation);
    }

    public function update(Request $request, Reservation $reservation)
    {
        $validator = Validator::make($request->all(), [
            'id_user' => 'required|integer',
            'id_book' => 'required|integer',
            'reservation_Date' => 'required|date',
            'expiryDate' => 'nullable|date',
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        if (!$reservation) {
            return response()->json(['message' => 'Reservation not found'], 404);
        }
        $reservation->update($request->all());
        return response()->json($reservation);
    }

    public function destroy(Reservation $reservation)
    {
        if (!$reservation) {
            return response()->json(['message' => 'Reservation not found'], 404);
        }
        $book = Book::find($reservation->book_id);
        $book->increment('quantity');
        $reservation->delete();
        return response()->json(['message' => 'Reservation deleted successfully']);
    }

    public function deleteExpiredReservations()
    {
        $expiredReservations = Reservation::where('expiryDate', '<', now())->get();
        foreach ($expiredReservations as $reservation) {
            $reservation->delete();
        }
        return response()->json(['message' => 'Expired reservations deleted successfully']);
    }


    public function approve(Reservation $reservation)
    {
        if (!$reservation) {
            return response()->json(['message' => 'Reservation not found'], 404);
        }

        try {
            $borrowRecordData = [
                'user_id' => $reservation->user_id,
                'book_id' => $reservation->book_id,
                'borrow_date' => now(),
                'due_date' => $reservation->expiryDate,
            ];

            $borrowRecord = BorrowRecord::create($borrowRecordData);

            $reservation->delete();

            return response()->json([
                'message' => 'Reservation approved and Borrow record created successfully',
                'borrow_record' => $borrowRecord
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error creating Borrow record: ' . $e->getMessage()], 422);
        }
    }
    //


   public function userReservations($userId)
   {
       $reservations = Reservation::where('user_id', $userId)->with('book')->with ('user')->get();
       return response()->json($reservations);
   }

}
