<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Book;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Models\WaitingList;
use Illuminate\Support\Facades\Mail;
use App\Mail\BookAvailableMail;
use Illuminate\Support\Facades\Log;

class BookController extends Controller
{
    public function index()
    {
        $books = Book::with('author:id,name', 'category:id,name')->get();
        return response()->json($books);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'description' => 'required|string',
            'author_id' => 'required',
            'category_id' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'quantity' => 'required|integer',
            'price' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->messages()], 422);
        }

        $imagePath = null;

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $imagePath = $file->store('images/books', ['disk' => 'public']);
        }

        $book = Book::create(array_merge($request->all(), ['image' => $imagePath]));

        return response()->json([
            'message' => 'Book created successfully',
            'book' => $book
        ]);
    }

    public function show(Book $book)
    {
        return response()->json($book->load('category:id,name', 'author:id,name'));
    }

    public function update(Request $request, Book $book)
    {
        try {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'description' => 'required|string',
            'author_id' => 'required|integer|exists:authors,id',
            'category_id' => 'required|integer|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'quantity' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
               return response()->json(['errors' => $validator->messages()], 422);
        }

        $data = $validator->validated();
            $oldQuantity = $book->quantity;
        $imagePath = $book->image;

        if ($request->hasFile('image')) {
            if ($imagePath) {
                Storage::disk('public')->delete($imagePath);
            }
            $imagePath = $request->file('image')->store('images/books', 'public');
        }

        $data['image'] = $imagePath;
        $book->update($data);

            // Check if quantity increased and handle waiting list
            if ($data['quantity'] > $oldQuantity && $data['quantity'] > 0) {
                $waitingListEntry = WaitingList::with('user')
                    ->where('book_id', $book->id)
                    ->orderBy('created_at', 'asc')
                    ->first();

                if ($waitingListEntry && $waitingListEntry->user) {
                    try {
                        // Send email notification
                        Mail::to($waitingListEntry->user->gmail)
                            ->send(new BookAvailableMail($book, $waitingListEntry->user));

                        // Remove from waiting list after successful email
                        $waitingListEntry->delete();

                        Log::info('Notification sent to user on waiting list from book update', [
                            'user_id' => $waitingListEntry->user->id,
                            'book_id' => $book->id,
                            'old_quantity' => $oldQuantity,
                            'new_quantity' => $data['quantity']
                        ]);
                    } catch (\Exception $e) {
                        Log::error('Failed to send waiting list notification from book update', [
                            'error' => $e->getMessage(),
                            'user_id' => $waitingListEntry->user->id,
                            'book_id' => $book->id
                        ]);
                    }
                }
            }

            return response()->json([
                'message' => 'Book updated successfully',
                'book' => $book->load(['author', 'category']),
                'waiting_list_notified' => isset($waitingListEntry)
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating book', [
                'error' => $e->getMessage(),
                'book_id' => $book->id
            ]);

            return response()->json([
                'message' => 'Failed to update book',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Book $book)
    {
        if (!$book) {
            return redirect()->back()->withErrors(['error' => 'Book not found'])->withInput();
        }

        $imagePath = $book->image;
        if ($imagePath) {
            Storage::disk('public')->delete($imagePath);
        }

        $book->delete();

        return response()->json([
            'message' => 'Book deleted successfully'
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->input('q');

        $books = Book::with(['author:id,name', 'category:id,name'])
            ->where('title', 'like', "%$query%")
            ->orWhere('description', 'like', "%$query%")
            ->orWhereHas('author', function ($q) use ($query) {
                $q->where('name', 'like', "%$query%");
            })
            ->orWhereHas('category', function ($q) use ($query) {
                $q->where('name', 'like', "%$query%");
            })
            ->get();

        return response()->json($books);
    }

    public function newArrivals()
    {
        $books = Book::with(['author:id,name', 'category:id,name'])
            ->latest()
            ->take(5)
            ->get();

        return response()->json($books);
    }

    public function getCategories()
    {
        $categories = DB::table('categories')
                        ->select('id', 'name')
                        ->get();

        return response()->json($categories);
    }

    public function getAuthors()
    {
        $authors = DB::table('authors')
                        ->distinct()
                        ->pluck('name');

        return response()->json($authors);
    }
}

