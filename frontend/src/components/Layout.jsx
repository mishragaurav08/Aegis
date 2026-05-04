import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children, setActivePage, activePage }) => {
  return (
    <div className="flex flex-col h-screen w-full bg-bg overflow-hidden relative">
      <div className="w-full px-4 md:px-6 pt-4 shrink-0">
        <div className="max-w-7xl mx-auto">
          <Navbar setActivePage={setActivePage} activePage={activePage} />
        </div>
      </div>
      <main className="flex-1 overflow-hidden p-4 md:p-6 w-full">
        <div className="max-w-7xl mx-auto h-full w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
