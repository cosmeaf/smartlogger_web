import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { handleLogout, user } = useContext(AuthContext);

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <input type="text" placeholder="Search..." className="border rounded p-2" />
      <div className="flex items-center">
        <span className="ml-2">{user?.username}</span>
        <button onClick={handleLogout} className="ml-4 bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>
    </header>
  );
};

export default Header;
