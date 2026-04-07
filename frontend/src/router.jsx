import { createBrowserRouter } from "react-router-dom";
import LibraryDashboard from "./views/LibraryDashboard";
import Login from "./views/Login";
import { UserTable } from "./components/admin/user/UserTable";
import { BookTable } from "./components/admin/book/BookTable";
import BookEditForm from "./components/admin/book/BookEditForm";    
import BookAddForm from "./components/admin/book/BookAddForm";
import UserEditForm from "./components/admin/user/UserEditForm";
import UserAddForm from "./components/admin/user/UserAddForm";
import { AuthorTable } from "./components/admin/author/AuthorTable";
import AuthorAddForm from "./components/admin/author/AuthorAddForm";
import AuthorsEditForm from "./components/admin/author/AuthorEditForm";         
import { CategoryTable } from "./components/admin/Category/CategoryTable";
import CategoryAddForm from "./components/admin/Category/CategoryAddForm";
import  CategoryEditForm  from "./components/admin/Category/CategoryEditForm";
import RegisterForm from "./views/registerRequest";
import { RequestTable } from "./components/admin/RegisterRequest/RegisterRequestTable";
import HomePage from "./views/user/HomePage";
import Layout from "./components/user/layout";
import BookCatalogPage from "./views/user/BookCatalogPage";
import BookDetailPage from "./views/user/BookDetailPage";
import BookDetail from "./components/user/BookDetailPage/BookDetail";
import UserDashboardPage from "./views/user/UserDashboardPage";
import ReservePage from "./views/user/ReservePage"
import CategoryBooks from "./components/user/BookCatalogPage/CategoryBooks";
import { ReservationTable } from "./components/admin/reservation/ReservationTable";
import { BorrowRecordTable } from "./components/admin/borrowRecord/BorrowRecordTable";
import BorrowRecordAddForm from "./components/admin/borrowRecord/BorrowRecordAddForm";
import {ReservationUserTable} from "./components/user/userDashboard/Reservations/ReservationsUserTable";
import { HistoryTable } from "./components/user/userDashboard/HistoryTable";
import { BorrowingTable } from "./components/user/userDashboard/BorrowingTable";
import { OverdueBookTable } from "./components/user/userDashboard/OverdueBookTable";
import  Profile  from "./components/user/userDashboard/Profile";
import  WaitingListTable  from "./components/admin/waitingList/WaitingList";
import  WaitingListAddForm  from "./components/admin/waitingList/WaitingListAddForm";
import { UserWaitingListTable } from "./components/user/userDashboard/UserWaitingList";




const router = createBrowserRouter([

 

    {
        path: "/login",
        element: <Login />,
    },

    {
        path: "/registerrequest",
        element: <RegisterForm />
    },


    // user 
    {
        path:"/",
        element:<Layout />,
        
        children:[
               {
        path: "/admin/dashboard",
        element: <LibraryDashboard />,
        children: [
            {
                path: "/admin/dashboard/users",
                element: <UserTable />,
            },
            {
                path: "/admin/dashboard/users/edit/:userId",
                element: <UserEditForm />,
            },
            {
                path: "/admin/dashboard/users/add/",
                element: <UserAddForm />,
            },
            {
                path: "/admin/dashboard/books",
                element: <BookTable />,
            },
            {
                path: "/admin/dashboard/books/edit/:id",
                element: <BookEditForm />,
            },
            {
                path: "/admin/dashboard/books/add",
                element: <BookAddForm />,
            },
            {
                path: "/admin/dashboard/authors",
                element: < AuthorTable/>,
            },
            {
                path: "/admin/dashboard/authors/add",
                element: < AuthorAddForm/>,
            },
            {
                path: "/admin/dashboard/authors/edit/:authorId",
                element: <AuthorsEditForm />,
            },

            {
                path: "/admin/dashboard/categories",
                element: < CategoryTable/>
            },

            {
                path: "/admin/dashboard/categories/add",
                element: < CategoryAddForm/>,
            },
            {
                path: "/admin/dashboard/categories/edit/:categoryId",
                element: < CategoryEditForm/>,
            },
            
            {
                path: "/admin/dashboard/reservations",
                element:<ReservationTable/> ,
            },
            {
                path: "/admin/dashboard/borrow-records",
                element: <BorrowRecordTable/>,
            },
              {
                path: "/admin/dashboard/borrow-records/add",
                element: <BorrowRecordAddForm/>,
            },
            {
                path: "/admin/dashboard/register-request",
                element: <RequestTable/>,
            },
            {
                path: "/admin/dashboard/waitinglist",
                element:<WaitingListTable/>,
            },
             {
                path: "/admin/dashboard/waitinglist/add",
                element:<WaitingListAddForm/>,
            },


        ]

    },
            {
                path:"/",
                element:<HomePage />,
            },
            {
                path:"/Catalogue",
                element: <BookCatalogPage />,
            },
            {
                path:"/book/",
                element: <BookDetailPage />,
            },
            {
                path:"/book/:id",
                element: <BookDetail />,

            },
            
            {
                path:"/dashboard",
                element: <UserDashboardPage />,
                children:[
                    {
                        path:"/dashboard/reservations",
                        element: <ReservationUserTable />,
                    },
                    {
                        path:"/dashboard/history",
                        element: <HistoryTable />,
                    }
                    ,
                    {
                        path:"/dashboard/borrowing",
                        element: <BorrowingTable />,
                    }
                    ,
                    {
                        path:"/dashboard/overdue-books",
                        element: <OverdueBookTable />,
                    }
                    ,
                    {
                        path:"/dashboard/profile",
                        element: <Profile />,
                    }
                    ,
                    {
                        path:"/dashboard/waitinglist",
                        element: <UserWaitingListTable />,
                    }
                ]
            },
            {
                path:"/ReservePage",
                element: <ReservePage />
            },
            {
                path:"/categories/:categoryId/books",
                element: <CategoryBooks />
            }



        ]

    },
    


]);

export default router;

