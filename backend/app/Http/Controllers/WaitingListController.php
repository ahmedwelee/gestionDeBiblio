<?php

namespace App\Http\Controllers;

use App\Models\WaitingList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WaitingListController extends Controller
{
    public function index()
    {
        // Fetch all waiting list entries
       $waitingLists = WaitingList::with(['user', 'book.author', 'book.category'])->get();
    return response()->json($waitingLists);
    }

    public function store(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'book_id' => 'required|exists:books,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->messages()], 422);
        }

        // Create a new waiting list entry
        $waitingList = WaitingList::create($request->all());

        return response()->json(['message' => 'Waiting list entry created successfully', 'data' => $waitingList], 201);
    }

    public function destroy($id)
    {
        // Find and delete the waiting list entry
        $waitingList = WaitingList::findOrFail($id);
        $waitingList->delete();

        return response()->json(['message' => 'Waiting list entry deleted successfully'], 204);
    }

    public function user($id)
    {
        // Fetch waiting list entries for a specific user
        $waitingLists = WaitingList::where('user_id', $id)->with(['book.author', 'book.category', 'user'])->get();

        return response()->json($waitingLists);
    }
}

