import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { logout } from '../redux/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';

const NavBar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="flex items-center">
        <Link to="/" className="text-xl font-bold mr-8">
          Recent Articles
        </Link>
        <Link to="/about" className="text-md hover:underline">
          About
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {!isAuthenticated ? (
          <Link to="/login" className="text-md hover:underline">
            Log in →
          </Link>
        ) : (
          <>
            <Link to="/my-articles" className="text-md hover:underline">
              My Articles
            </Link>
            <Link to="/create-article" className="text-md hover:underline">
              Create Article
            </Link>
            <span className="font-semibold">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition duration-200"
            >
              Log out
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
