<?php

namespace App\Http\Controllers;

use App\Models\Author;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuthorController extends Controller
{

    public function index()
    {
        return response()->json(Author::all());
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'piography' => 'required|string',
        ]);

        if ($validator->fails()) {
       return response()->json(['error' => $validator->messages()], 422);

        }

        $author = Author::create($request->all());

        return response()->json([
            'message' => 'Author created successfully',
            'author' => $author
        ]);
    }

    public function show($id)
    {
        $author = Author::find($id);
        if (!$author){
           return response()->json(['message' => 'Category not found'], 404);

        }
        return response()->json($author);
    }


    public function update(Request $request, Author $author)
    {

        if (!$author) {
            return response()->json(['message' => 'Author not found'], 404);
        }
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'piography' => 'required|string',
        ]);

        if ($validator->fails()) {
          return response()->json(['errors' => $validator->messages()], 422);

        }
        $author->update($request->all());

        return response()->json($author);

    }
    public function destroy(Author $author)
    {
        if (!$author) {
            return response()->json(['message' => 'Author not found'], 404);
        }
        $author->delete();
        return response()->json(['message' => 'Author deleted successfully']);
    }
}


