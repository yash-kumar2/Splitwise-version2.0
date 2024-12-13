import React from 'react';

const Header = () => {
  return (
    <header className="bg-blue-600 p-4 ">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white font-bold text-2xl md:ml-15">Split-Easy</h1>
        <button className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>
    </header>
  );
};

export default Header;
