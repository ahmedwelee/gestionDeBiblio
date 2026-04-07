import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Outlet, useLocation } from "react-router";

const Layout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gradient-to-br dark:from-midnight-950 dark:via-slate-900 dark:to-midnight-950 transition-colors duration-500">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

