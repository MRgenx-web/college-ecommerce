// Responsive top navigation: logo, search, cart badge, and an auth-aware
// user menu (login/register vs. profile/logout, plus an admin dashboard link).
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import SearchBar from '../product/SearchBar';

function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(search ? `/products?search=${encodeURIComponent(search)}` : '/products');
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3.5 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-1 text-xl font-extrabold tracking-tight text-blue-600 transition-opacity hover:opacity-80">
          TechKart <span className="text-gray-800">India</span>
        </Link>

        <form onSubmit={handleSearchSubmit} className="hidden flex-1 md:block">
          <SearchBar value={search} onChange={setSearch} />
        </form>

        <nav className="hidden items-center gap-6 text-sm font-medium text-gray-700 md:flex">
          <Link to="/" className="transition-colors hover:text-blue-600">Home</Link>
          <Link to="/products" className="transition-colors hover:text-blue-600">Products</Link>
          {isAdmin && (
            <Link to="/admin/dashboard" className="transition-colors hover:text-blue-600">Admin</Link>
          )}
        </nav>

        <Link
          to="/cart"
          aria-label={`Cart, ${totalItems} item${totalItems === 1 ? '' : 's'}`}
          className="relative shrink-0 rounded-lg p-2 transition-colors hover:bg-gray-100"
        >
          <span aria-hidden="true">🛒</span>
          {totalItems > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 animate-fade-in items-center justify-center rounded-full bg-blue-600 text-[11px] font-semibold text-white shadow-sm">
              {totalItems}
            </span>
          )}
        </Link>

        {isAuthenticated ? (
          <div className="hidden items-center gap-3 md:flex">
            <Link to="/profile" className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600">
              Hi, {user.name.split(' ')[0]}
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="hidden items-center gap-2 md:flex">
            <Link
              to="/login"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
            >
              Register
            </Link>
          </div>
        )}

        <button
          type="button"
          className="shrink-0 rounded-lg p-2 text-xl transition-colors hover:bg-gray-100 md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-200 px-4 py-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="mb-3">
            <SearchBar value={search} onChange={setSearch} />
          </form>
          <nav className="flex flex-col gap-2 text-sm font-medium text-gray-700">
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link>
            {isAdmin && <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)}>Admin</Link>}
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
                <button type="button" onClick={handleLogout} className="text-left text-red-600">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
