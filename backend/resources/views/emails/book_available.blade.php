<!DOCTYPE html>
<html>
<head>
    <title>Book Available Notification</title>
</head>
<body>
    <h2>Hello {{ $user->name }},</h2>

    <p>The book <strong>{{ $book->title }}</strong> that you were waiting for is now available.</p>

    <p>Please visit the library or reserve it online before it’s borrowed by someone else!</p>

    <br>

    <p>Thanks,<br>Library Team</p>
</body>
</html>
