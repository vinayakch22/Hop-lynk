import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { useDebounce } from '../../hooks/useDebounce';
import { useTheme } from '../../context/ThemeContext';
import { useAuthStore } from '../../store/authStore';
import { buildShortUrl } from '../../utils/formatters';

export const CommandPalette = ({ onClose }) => {
  const navigate = useNavigate();
  const { toggleTheme } = useTheme();
  const { logout } = useAuthStore();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [urls, setUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Fetch search results when debounced search query changes
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setUrls([]);
      return;
    }
    const searchUrls = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get('/api/urls', {
          params: { page: 1, limit: 5, search: debouncedSearch },
        });
        setUrls(data.urls || []);
      } catch (err) {
        console.error('Command palette search error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    searchUrls();
  }, [debouncedSearch]);

  // Command items definition
  const commands = [
    {
      id: 'create-link',
      title: 'Create new link',
      subtitle: 'Create a shortened URL alias',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      action: () => {
        navigate('/dashboard?create=true');
        onClose();
      },
    },
    {
      id: 'go-dashboard',
      title: 'Go to Dashboard',
      subtitle: 'View your analytics and active links',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      ),
      action: () => {
        navigate('/dashboard');
        onClose();
      },
    },
    {
      id: 'go-profile',
      title: 'Go to Profile Settings',
      subtitle: 'Manage credentials and profile details',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      action: () => {
        navigate('/profile');
        onClose();
      },
    },
    {
      id: 'toggle-theme',
      title: 'Toggle Theme Mode',
      subtitle: 'Switch between light and dark display mode',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
      action: () => {
        toggleTheme();
        toast.success('Theme updated! 🌓');
        onClose();
      },
    },
    {
      id: 'logout',
      title: 'Log out',
      subtitle: 'Securely sign out of your account',
      icon: (
        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ),
      action: async () => {
        try {
          await logout();
          toast.success('Goodbye! 👋');
          navigate('/');
        } catch {
          toast.error('Logout failed');
        }
        onClose();
      },
    },
  ];

  // Group search items and commands
  const hasSearchResults = urls.length > 0;
  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.title.toLowerCase().includes(search.toLowerCase()) ||
      cmd.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  const totalItems = urls.length + filteredCommands.length;

  // Handle keyboard index changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search, urls]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (totalItems > 0 ? (prev + 1) % totalItems : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (totalItems > 0 ? (prev - 1 + totalItems) % totalItems : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      triggerSelectedItem();
    }
  };

  const triggerSelectedItem = () => {
    if (totalItems === 0) return;
    if (selectedIndex < urls.length) {
      handleUrlClick(urls[selectedIndex]);
    } else {
      const commandIndex = selectedIndex - urls.length;
      filteredCommands[commandIndex]?.action();
    }
  };

  const handleUrlClick = async (url) => {
    try {
      await navigator.clipboard.writeText(buildShortUrl(url.shortCode));
      toast.success('Short link copied to clipboard! 📋');
    } catch {
      toast.error('Failed to copy link');
    }
    onClose();
  };

  // Close when clicking outside modal container
  const handleOverlayClick = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-[12vh] px-4"
    >
      <div
        ref={containerRef}
        className="w-full max-w-lg bg-(--card) border border-(--border) rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[50vh] animate-fade-in-up"
      >
        {/* Header Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-(--border) shrink-0">
          <svg className="w-5 h-5 text-(--text-muted) shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search links or trigger commands..."
            className="w-full bg-transparent border-0 text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:ring-0 focus:outline-none"
          />
          <span className="text-[10px] px-1.5 py-0.5 rounded border border-(--border) bg-(--bg) text-(--text-muted) shrink-0 select-none">
            ESC
          </span>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 p-2 space-y-4">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <svg className="animate-spin h-5 w-5 text-brand-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          )}

          {/* Links & Aliases Results Section */}
          {!isLoading && hasSearchResults && (
            <div className="space-y-1">
              <h3 className="px-3 py-1.5 text-[10px] font-semibold text-(--text-muted) uppercase tracking-wider">
                Links & Aliases
              </h3>
              {urls.map((url, idx) => {
                const isHighlighted = idx === selectedIndex;
                return (
                  <button
                    key={url._id}
                    onClick={() => handleUrlClick(url)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between gap-3 transition-colors ${
                      isHighlighted ? 'bg-brand-500/10 text-brand-600' : 'text-(--text-secondary) hover:bg-(--bg)'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium text-xs truncate">
                          /r/{url.shortCode}
                        </span>
                        {url.customAlias && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-(--border) text-(--text-muted) rounded">
                            alias
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-(--text-muted) truncate mt-0.5">
                        {url.originalUrl}
                      </p>
                    </div>
                    <span className="text-[10px] font-medium text-(--text-muted) whitespace-nowrap shrink-0">
                      {url.totalClicks} clicks
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* System Commands Section */}
          {!isLoading && filteredCommands.length > 0 && (
            <div className="space-y-1">
              <h3 className="px-3 py-1.5 text-[10px] font-semibold text-(--text-muted) uppercase tracking-wider">
                System Commands
              </h3>
              {filteredCommands.map((cmd, idx) => {
                const overallIdx = urls.length + idx;
                const isHighlighted = overallIdx === selectedIndex;
                return (
                  <button
                    key={cmd.id}
                    onClick={cmd.action}
                    onMouseEnter={() => setSelectedIndex(overallIdx)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors ${
                      isHighlighted ? 'bg-brand-500/10 text-brand-600' : 'text-(--text-secondary) hover:bg-(--bg)'
                    }`}
                  >
                    <div className="shrink-0">{cmd.icon}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium">{cmd.title}</p>
                      <p className="text-[10px] text-(--text-muted) truncate mt-0.5">
                        {cmd.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Empty Search State */}
          {!isLoading && totalItems === 0 && (
            <div className="text-center py-10 text-(--text-muted)">
              <p className="text-sm">No results match your search query</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
