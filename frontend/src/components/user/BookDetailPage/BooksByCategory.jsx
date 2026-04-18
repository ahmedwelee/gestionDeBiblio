import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axiosClient from '../../../axiosClient';
import { getImageUrl } from '../../../utils/imageHelper';

const BooksByCategory = ({ categoryId, currentBookId }) => {
  const [allBooks, setAllBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/books');
        setAllBooks(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    if (allBooks.length > 0) {
      const filtered = allBooks.filter(
        (book) => book.category_id === categoryId && book.id !== currentBookId
      );
      setFilteredBooks(filtered);
    }
  }, [allBooks, categoryId, currentBookId]);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  const Loader = () => (
    <div className="flex justify-center items-center py-10">
      <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-solid border-gray-200 border-t-blue-600 rounded-full"></div>
    </div>
  );

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Erreur: {error}</div>;
  }

  if (filteredBooks.length === 0) {
    return <div className="text-center py-10">Aucun livre trouvé</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* <h2 className="text-3xl font-serif text-gray-800 mb-6">Autres livres de la même catégorie</h2> */}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.slice(0, visibleCount).map((book) => (
          <div key={book.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={getImageUrl(book.image)}
              alt={book.title}
              className="w-full h-36 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">
                <Link to={`/book/${book.id}`} className="text-blue-600 hover:underline">
                  {book.title}
                </Link>
              </h2>
              <p className="text-sm text-gray-600">{book.author.name}</p>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < filteredBooks.length && (
        <div className="text-center mt-8">
          <button
            onClick={handleShowMore}
            className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-full font-semibold transition-all"
          >
            Voir plus
          </button>
        </div>
      )}
    </div>
  );
};

export default BooksByCategory;

