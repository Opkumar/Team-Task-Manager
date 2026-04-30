import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const linkClass = (path) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      location.pathname === path
        ? 'bg-indigo-700 text-white'
        : 'text-indigo-100 hover:bg-indigo-500'
    }`;

  return (
    <nav className="bg-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-white font-bold text-xl">TaskManager</Link>
            <Link to="/" className={linkClass('/')}>Dashboard</Link>
            <Link to="/projects" className={linkClass('/projects')}>Projects</Link>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-indigo-100 text-sm">{user?.name}</span>
            <button onClick={logout} className="bg-indigo-800 text-white px-3 py-1.5 rounded text-sm hover:bg-indigo-900">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
