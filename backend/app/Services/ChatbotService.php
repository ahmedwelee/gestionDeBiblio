<?php

namespace App\Services;

use App\Models\BorrowRecord;
use App\Models\Book;
use App\Models\Reservation;
use App\Models\User;
use Carbon\Carbon;

class ChatbotService
{
    protected $user;
    protected $language;

    public function __construct(User $user, $language = 'en')
    {
        $this->user = $user;
        $this->language = $language;
    }

    /**
     * Process user message and generate response
     */
    public function processMessage($userMessage)
    {
        $response = $this->detectIntentAndRespond($userMessage);
        return $response;
    }

    /**
     * Detect intent from user message and generate appropriate response
     */
    protected function detectIntentAndRespond($message)
    {
        $lowercaseMessage = strtolower($message);

        // Detect intent based on keywords
        if ($this->matchesKeywords($lowercaseMessage, ['borrow', 'how.*borrow', 'can i borrow'])) {
            return $this->getBorrowingInfoResponse();
        }

        if ($this->matchesKeywords($lowercaseMessage, ['overdue', 'late', 'returned', 'penalty', 'fine'])) {
            return $this->getOverdueInfoResponse();
        }

        if ($this->matchesKeywords($lowercaseMessage, ['reservation', 'reserve', 'book a book'])) {
            return $this->getReservationInfoResponse();
        }

        if ($this->matchesKeywords($lowercaseMessage, ['my books', 'current books', 'borrowing'])) {
            return $this->getUserBooksResponse();
        }

        if ($this->matchesKeywords($lowercaseMessage, ['search', 'find', 'looking for'])) {
            return $this->getSearchHelpResponse();
        }

        if ($this->matchesKeywords($lowercaseMessage, ['profile', 'account', 'my info'])) {
            return $this->getUserProfileResponse();
        }

        if ($this->matchesKeywords($lowercaseMessage, ['help', 'support', 'contact'])) {
            return $this->getHelpResponse();
        }

        // Default response for unknown queries
        return $this->getDefaultResponse();
    }

    /**
     * Match keywords in message
     */
    protected function matchesKeywords($message, $keywords)
    {
        foreach ($keywords as $keyword) {
            if (preg_match("/$keyword/i", $message)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get borrowing information response
     */
    protected function getBorrowingInfoResponse()
    {
        $responses = [
            'en' => "To borrow a book, please:\n1. Find the book you're interested in\n2. Click 'Borrow' button\n3. Select the borrow duration (14 days by default)\n4. Confirm your request\n\nYou can borrow up to 5 books at a time. Need more help?",
            'ar' => "لاستعارة كتاب، يرجى:\n1. البحث عن الكتاب الذي تريده\n2. الضغط على زر 'استعارة'\n3. تحديد مدة الاستعارة (14 يوم افتراضياً)\n4. تأكيد طلبك\n\nيمكنك استعارة حتى 5 كتب في المرة الواحدة. هل تريد مساعدة أخرى؟",
            'fr' => "Pour emprunter un livre, veuillez:\n1. Trouver le livre que vous recherchez\n2. Cliquer sur le bouton 'Emprunter'\n3. Sélectionner la durée d'emprunt (14 jours par défaut)\n4. Confirmer votre demande\n\nVous pouvez emprunter jusqu'à 5 livres à la fois. Besoin d'aide?",
        ];

        return $responses[$this->language] ?? $responses['en'];
    }

    /**
     * Get user's current borrowed books
     */
    protected function getUserBooksResponse()
    {
        $books = BorrowRecord::where('user_id', $this->user->id)
            ->where('return_date', null)
            ->with('book')
            ->get();

        if ($books->isEmpty()) {
            $responses = [
                'en' => "You don't have any currently borrowed books.",
                'ar' => "ليس لديك أي كتب مستعارة حالياً.",
                'fr' => "Vous n'avez pas de livres empruntés actuellement.",
            ];
            return $responses[$this->language] ?? $responses['en'];
        }

        $bookList = $books->map(function ($record) {
            return "- {$record->book->title} (Due: " . $record->due_date . ")";
        })->join("\n");

        $responses = [
            'en' => "Your currently borrowed books:\n$bookList",
            'ar' => "الكتب المستعارة لديك حالياً:\n$bookList",
            'fr' => "Vos livres empruntés actuellement:\n$bookList",
        ];

        return $responses[$this->language] ?? $responses['en'];
    }

    /**
     * Get overdue information
     */
    protected function getOverdueInfoResponse()
    {
        $overdueBooks = BorrowRecord::where('user_id', $this->user->id)
            ->where('return_date', null)
            ->where('due_date', '<', Carbon::now())
            ->with('book')
            ->get();

        if ($overdueBooks->isEmpty()) {
            $responses = [
                'en' => "Great! You don't have any overdue books.",
                'ar' => "رائع! ليس لديك أي كتب متأخرة.",
                'fr' => "Excellent! Vous n'avez pas de livres en retard.",
            ];
            return $responses[$this->language] ?? $responses['en'];
        }

        $bookList = $overdueBooks->map(function ($record) {
            $daysLate = Carbon::now()->diffInDays($record->due_date);
            return "- {$record->book->title} ({$daysLate} days overdue)";
        })->join("\n");

        $responses = [
            'en' => "Overdue books:\n$bookList\n\nPlease return them as soon as possible to avoid penalties.",
            'ar' => "الكتب المتأخرة:\n$bookList\n\nيرجى إعادتها في أقرب وقت لتجنب الغرامات.",
            'fr' => "Livres en retard:\n$bookList\n\nVeuillez les retourner dès que possible pour éviter les amendes.",
        ];

        return $responses[$this->language] ?? $responses['en'];
    }

    /**
     * Get reservation information
     */
    protected function getReservationInfoResponse()
    {
        $responses = [
            'en' => "To reserve a book:\n1. Go to the book details page\n2. Click 'Reserve' button (if available)\n3. You'll be notified when the book is available\n4. Visit the library to pick it up\n\nReservations are held for 3 days.",
            'ar' => "لحجز كتاب:\n1. اذهب إلى صفحة تفاصيل الكتاب\n2. انقر على زر 'حجز' (إذا كان متاحاً)\n3. سيتم إخطارك عند توفر الكتاب\n4. قم بزيارة المكتبة لاستلامه\n\nيتم الاحتفاظ بالحجوزات لمدة 3 أيام.",
            'fr' => "Pour réserver un livre:\n1. Allez à la page des détails du livre\n2. Cliquez sur le bouton 'Réserver' (si disponible)\n3. Vous serez notifié quand le livre est disponible\n4. Visitez la bibliothèque pour le récupérer\n\nLes réservations sont conservées pendant 3 jours.",
        ];

        return $responses[$this->language] ?? $responses['en'];
    }

    /**
     * Get search help response
     */
    protected function getSearchHelpResponse()
    {
        $responses = [
            'en' => "You can search for books by:\n- Title\n- Author name\n- Category\n- Keyword\n\nUse the search bar at the top to find what you're looking for!",
            'ar' => "يمكنك البحث عن الكتب حسب:\n- العنوان\n- اسم المؤلف\n- الفئة\n- الكلمة المفتاحية\n\nاستخدم شريط البحث في الأعلى للعثور على ما تبحث عنه!",
            'fr' => "Vous pouvez rechercher des livres par:\n- Titre\n- Nom d'auteur\n- Catégorie\n- Mot-clé\n\nUtilisez la barre de recherche en haut pour trouver ce que vous cherchez!",
        ];

        return $responses[$this->language] ?? $responses['en'];
    }

    /**
     * Get user profile information
     */
    protected function getUserProfileResponse()
    {
        $responses = [
            'en' => "Your Profile:\nName: {$this->user->name}\nEmail: {$this->user->email}\nPhone: {$this->user->phone}\nRole: {$this->user->role}\n\nTo update your profile, visit your account settings.",
            'ar' => "ملفك الشخصي:\nالاسم: {$this->user->name}\nالبريد الإلكتروني: {$this->user->email}\nالهاتف: {$this->user->phone}\nالدور: {$this->user->role}\n\nلتحديث ملفك، قم بزيارة إعدادات حسابك.",
            'fr' => "Votre Profil:\nNom: {$this->user->name}\nEmail: {$this->user->email}\nTéléphone: {$this->user->phone}\nRôle: {$this->user->role}\n\nPour mettre à jour votre profil, visitez les paramètres de votre compte.",
        ];

        return $responses[$this->language] ?? $responses['en'];
    }

    /**
     * Get help and support response
     */
    protected function getHelpResponse()
    {
        $responses = [
            'en' => "How can I help you?\n\nCommon topics:\n- Borrowing books\n- Reservations\n- Overdue books\n- Searching\n- My account\n\nFor additional support, contact the librarian at support@library.com",
            'ar' => "كيف يمكنني مساعدتك؟\n\nالمواضيع الشائعة:\n- استعارة الكتب\n- الحجوزات\n- الكتب المتأخرة\n- البحث\n- حسابي\n\nللحصول على دعم إضافي، اتصل بأمين المكتبة على support@library.com",
            'fr' => "Comment puis-je vous aider?\n\nSujets courants:\n- Emprunter des livres\n- Réservations\n- Livres en retard\n- Recherche\n- Mon compte\n\nPour un support supplémentaire, contactez le bibliothécaire à support@library.com",
        ];

        return $responses[$this->language] ?? $responses['en'];
    }

    /**
     * Get default response for unknown queries
     */
    protected function getDefaultResponse()
    {
        $responses = [
            'en' => "I'm not sure I understand. Can you rephrase your question? You can ask me about:\n- Borrowing books\n- Reservations\n- Overdue books\n- Searching for books\n- Your account",
            'ar' => "أنا لست متأكداً من فهمي للسؤال. هل يمكنك إعادة صياغة سؤالك؟ يمكنك أن تسأل عن:\n- استعارة الكتب\n- الحجوزات\n- الكتب المتأخرة\n- البحث عن الكتب\n- حسابك",
            'fr' => "Je ne suis pas sûr de comprendre. Pouvez-vous reformuler votre question? Vous pouvez me poser des questions sur:\n- Emprunter des livres\n- Réservations\n- Livres en retard\n- Rechercher des livres\n- Votre compte",
        ];

        return $responses[$this->language] ?? $responses['en'];
    }
}

