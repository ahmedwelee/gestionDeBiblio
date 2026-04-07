import React from 'react';

import BookDisplay from '../../components/user/BookDetailPage/BookDisplay';
import ReserveBook from '../../components/user/BookDetailPage/ReserveBook';
import Search from '../../components/user/BookCatalogPage/Search';
import Footer from '../../components/user/Footer';



const BookDetailPage = () => {
    return (
      <>
        <div>
          <h1 className="text-2xl font-bold"></h1>
          <Search/>
          <BookDisplay/>
    
       
        </div>
      </>
    );
};

export default BookDetailPage;