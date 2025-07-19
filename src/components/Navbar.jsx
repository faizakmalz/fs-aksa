import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleDarkMode } = useTheme();
  const [dropdownOpenDesktop, setDropdownOpenDesktop] = useState(false);
  const [dropdownOpenMobile, setDropdownOpenMobile] = useState(false);
  const desktopRef = useRef(null);
  const mobileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (desktopRef.current && !desktopRef.current.contains(e.target)) {
        setDropdownOpenDesktop(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        setDropdownOpenMobile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-black dark:text-white leading-tight">
          Kepegawaian<br /><b>Gedangan</b>
        </Link>

        <div className="hidden md:flex gap-6 items-center text-black dark:text-white">
          <Link to="/employees">Employees</Link>
          <button
            onClick={toggleDarkMode}
            className="bg-gray-700 dark:bg-white text-white dark:text-gray-700 px-3 py-1 rounded shadow"
          >
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
          <div className='relative' ref={desktopRef}>
            <button
              onClick={() => setDropdownOpenDesktop(!dropdownOpenDesktop)}
              className="text-gray-900 dark:text-white font-semibold focus:outline-none cursor-pointer"
            >
              {user?.name}
            </button>
            {dropdownOpenDesktop && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded shadow">
                <Link to={'/profile'} className='block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 text-sm text-gray-700 dark:text-white cursor-pointer'>Profile</Link>
                <button
                  onClick={logout}
                  className="block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 text-sm text-gray-700 dark:text-white cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="md:hidden relative" ref={mobileRef}>
          <button onClick={() => setDropdownOpenMobile(!dropdownOpenMobile)} className="text-black dark:text-white text-2xl">
            ☰
          </button>
          {dropdownOpenMobile && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded shadow z-50">
              <Link to="/employees" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white text-sm">
                Employees
              </Link>
              <button
                onClick={toggleDarkMode}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white text-sm"
              >
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </button>
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white text-sm">
                Profile
              </Link>
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
