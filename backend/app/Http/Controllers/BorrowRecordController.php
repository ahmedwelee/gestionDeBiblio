<?php

namespace App\Http\Controllers;

use App\Models\BorrowRecord;
use App\Models\WaitingList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\BookAvailableMail;


class BorrowRecordController extends Controller
{

    public function index()
    {
        $borrowRecords = BorrowRecord::with(['user', 'book.author', 'book.category'])->get();
        return response()->json($borrowRecords);
    }

    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer',
            'book_id' => 'required|integer',
            'borrow_date' => 'required|date',
            'due_date' => 'nullable|date',
        ]);
        if ($validator->fails()) {
           return response()->json(['errors' => $validator->messages()], 422);

        }
        $borrowRecord = BorrowRecord::create($request->all());
        return response()->json([
            'message' => 'Borrow record created successfully',
            'borrowRecord' => $borrowRecord->load(['user', 'book.author', 'book.category'])
        ]);
    }


    public function show(BorrowRecord $borrowRecord)
    {

        if (!$borrowRecord) {
            return response()->json(['message' => 'Borrow record not found'], 404);
        }
        return response()->json($borrowRecord->load(['user', 'book.author', 'book.category']));
    }

    public function update(Request $request, $id)
    {
        $borrowRecord = BorrowRecord::find($id);

        if (!$borrowRecord) {
            return response()->json(['message' => 'Borrow record not found'], 404);
        }

        $borrowRecord->update(['return_date' => now()]);

        $book = $borrowRecord->book;
        $book->increment('quantity');

       if ($book->quantity > 0) {
        $waitingListEntry = WaitingList::with('user')
            ->where('book_id', $book->id)
            ->orderBy('created_at', 'asc')
            ->first();

        if ($waitingListEntry && $waitingListEntry->user) {
            Mail::to($waitingListEntry->user->gmail)
                ->send(new BookAvailableMail($book, $waitingListEntry->user));
                   $waitingListEntry->delete();
        }
    }


        return response()->json([
            'message' => 'Borrow record updated successfully',
            'borrow_record' => $borrowRecord
        ]);
    }

    public function destroy(BorrowRecord $borrowRecord)
    {
        if (!$borrowRecord) {
            return response()->json(['message' => 'Borrow record not found'], 404);
        }
        $borrowRecord->delete();
        return response()->json(['message' => 'Borrow record deleted successfully',
            'borrow_record' => $borrowRecord
        ]);
    }


    // user
    public function userBorrowRecords($userId)
    {
        $borrowRecords = BorrowRecord::where('user_id', $userId)
            ->whereNull('return_date')
            ->with(['user', 'book.author', 'book.category'])
            ->get();
        return response()->json($borrowRecords);
    }
    public function userOverdueBorrowRecords($userId)
    {
        $borrowRecords = BorrowRecord::where('user_id', $userId)
            ->whereNull('return_date')
            ->where('due_date', '<', now())
            ->with(['user', 'book.author', 'book.category'])
            ->get();
        return response()->json($borrowRecords);
    }


    public function userReturnedBorrowRecords($userId)
    {
        $borrowRecords = BorrowRecord::where('user_id', $userId)
            ->whereNotNull('return_date')
            ->with(['user', 'book.author', 'book.category'])
            ->get();

        return response()->json($borrowRecords);
    }

    public function user($id)
    {
        $borrowRecords = BorrowRecord::where('user_id', $id)
            ->whereNull('return_date')
            ->with(['book.author', 'book.category'])
            ->get();

        return response()->json($borrowRecords);
    }

    public function userHistory($id)
    {
        $borrowRecords = BorrowRecord::where('user_id', $id)
            ->whereNotNull('return_date')
            ->with(['book.author', 'book.category'])
            ->get();

        return response()->json($borrowRecords);
    }

    public function userOverdue($id)
    {
        $borrowRecords = BorrowRecord::where('user_id', $id)
            ->whereNull('return_date')
            ->where('due_date', '<', now())
            ->with(['book.author', 'book.category'])
            ->get();

        return response()->json($borrowRecords);
    }

}
