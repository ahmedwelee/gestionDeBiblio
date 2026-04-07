import React from 'react';
import Search from '../../components/user/BookCatalogPage/Search';
import CategoryList from '../../components/user/BookCatalogPage/CategoryList';
import NewArrivals from '../../components/user/BookCatalogPage/NewArrivals';

const BookCatalogPage = () => {
  return (
    <>
      <Search />
      <CategoryList />
      <NewArrivals />
    </>
  );
};

export default BookCatalogPage;

