import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { ThemeToggle } from './ThemeToggle';
import { CommandPalette } from './CommandPalette';

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showPalette, setShowPalette] = useState(false);

  // Monitor global key presses for Ctrl+K search shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowPalette((o) => !o);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch {
      toast.error('Logout failed');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-(--border) bg-(--surface)">
      <div className="mx-auto px-5 sm:px-8 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="lg:hidden p-1.5 rounded-lg text-(--text-secondary) hover:bg-(--bg) hover:text-(--text-primary) transition-colors"
            onClick={() => setMobileNavOpen((o) => !o)}
            aria-label="Toggle navigation menu"
            id="nav-hamburger-btn"
          >
            <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileNavOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
          <Link to="/dashboard" className="flex items-center gap-2" id="nav-logo">
            <img src="/logo.png" alt="Hop Lynk Logo" className="w-8 h-8 object-contain rounded" />
            <span className="text-sm font-semibold text-(--text-primary)">Hop Lynk</span>
          </Link>
          <Link
            to="/dashboard"
            id="nav-dashboard"
            className="hidden sm:inline-flex text-sm font-medium text-(--text-secondary) hover:text-(--text-primary)"
          >
            Dashboard
          </Link>
        </div>

        {user && (
          <button
            type="button"
            onClick={() => setShowPalette(true)}
            id="nav-search-btn"
            className="hidden md:flex items-center justify-between gap-3 px-3 py-1.5 w-80 text-sm border border-(--border) rounded-lg bg-(--bg) text-(--text-muted) hover:text-(--text-secondary) transition-all"
            aria-label="Open command palette"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-(--text-muted)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search or command</span>
            </div>
            <kbd className="text-[10px] px-1.5 py-0.5 rounded border border-(--border) bg-(--surface) text-(--text-muted) font-sans">Ctrl K</kbd>
          </button>
        )}

        <div className="flex items-center gap-2">
          {user && (
            <button
              type="button"
              onClick={() => setShowPalette(true)}
              className="md:hidden p-2 rounded-lg text-(--text-secondary) hover:bg-(--bg) transition-colors"
              aria-label="Search"
              id="nav-mobile-search-btn"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          )}
          <ThemeToggle />

          <div className="relative">
            <button
              id="nav-user-menu"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg hover:bg-(--bg) transition-colors"
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              <div className="w-7 h-7 rounded-full border border-(--border) bg-(--bg) flex items-center justify-center text-[11px] font-semibold text-(--text-secondary) select-none">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="hidden sm:block text-sm font-medium text-(--text-primary) max-w-24 truncate">
                {user?.name || 'User'}
              </span>
              <svg className={`w-4 h-4 text-(--text-muted) transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-52 bg-(--card) border border-(--border) rounded-lg shadow-xl z-20 py-1 animate-fade-in-up overflow-hidden">
                  <div className="px-4 py-3 border-b border-(--border)">
                    <p className="text-sm font-medium text-(--text-primary) truncate">{user?.name}</p>
                    <p className="text-xs text-(--text-muted) truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full text-left px-4 py-2 text-sm text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg) transition-colors border-b border-(--border)"
                    id="nav-profile-btn"
                  >
                    Profile settings
                  </Link>
                  <button
                    id="nav-logout-btn"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                  >
                    {isLoggingOut ? 'Logging out…' : 'Log out'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {mobileNavOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden animate-fade-in" onClick={() => setMobileNavOpen(false)} />
          <div className="fixed top-14 left-0 bottom-0 w-64 bg-(--card) border-r border-(--border) z-40 p-4 space-y-4 lg:hidden animate-slide-in-left overflow-y-auto">
            <Link
              to="/dashboard"
              onClick={() => setMobileNavOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg) transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              onClick={() => setMobileNavOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg) transition-colors"
            >
              Profile
            </Link>
            <div className="pt-4 border-t border-(--border)">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
              >
                {isLoggingOut ? 'Logging out…' : 'Log out'}
              </button>
            </div>
          </div>
        </>
      )}

      {showPalette && user && <CommandPalette onClose={() => setShowPalette(false)} />}
    </nav>
  );
};
