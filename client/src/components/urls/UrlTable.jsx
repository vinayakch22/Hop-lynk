import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { buildShortUrl, truncate, formatRelativeDate, formatDate, formatNumber } from '../../utils/formatters';

const getStatusBadge = (url) => {
  if (!url.isActive) return <Badge variant="inactive">● Inactive</Badge>;
  if (url.expiresAt && new Date() > new Date(url.expiresAt)) return <Badge variant="expired">⏰ Expired</Badge>;
  return <Badge variant="active">● Active</Badge>;
};

export const UrlTable = ({ urls, onEdit, onDelete, onToggle, onQR, onCreate }) => {
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    if (!openMenu) return;
    const handleClick = () => setOpenMenu(null);
    const handleScroll = () => setOpenMenu(null);
    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleScroll);
    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
    };
  }, [openMenu]);

  const handleCopy = async (shortCode) => {
    try {
      await navigator.clipboard.writeText(buildShortUrl(shortCode));
      toast.success('Copied to clipboard!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleDelete = async (url) => {
    if (!window.confirm(`Delete "${url.shortCode}"? This cannot be undone.`)) return;
    setDeletingId(url._id);
    try {
      await onDelete(url._id);
      toast.success('URL deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggle = async (url) => {
    setTogglingId(url._id);
    try {
      await onToggle(url._id);
      toast.success(`URL ${url.isActive ? 'deactivated' : 'activated'}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Toggle failed');
    } finally {
      setTogglingId(null);
    }
  };

  if (urls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-xl bg-(--bg) border border-(--border) flex items-center justify-center mb-4 text-(--text-muted)">
          /r
        </div>
        <h3 className="text-base font-semibold text-(--text-primary) mb-1">No links yet</h3>
        <p className="text-sm text-(--text-muted)">Create your first short link to see analytics</p>
        {onCreate && (
          <Button
            onClick={onCreate}
            className="mt-4"
          >
            Create link
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-visible">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-(--border)">
            {['Short URL', 'Destination', 'Clicks', 'Status', 'Created', 'Actions'].map((h) => (
              <th
                key={h}
                className={`px-4 py-3 align-middle text-[11px] font-semibold text-(--text-muted) uppercase tracking-wider`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-(--border)">
          {urls.map((url) => (
            <tr key={url._id} className="table-row-hover transition-colors align-middle">
              {/* Short URL */}
              <td className="px-4 py-3 align-middle">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-(--color-brand-600) font-medium">
                    /r/{url.shortCode}
                  </span>
                  <button
                    onClick={() => handleCopy(url.shortCode)}
                    title="Copy short URL"
                    className="text-(--text-muted) hover:text-(--text-secondary) transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </td>
              {/* Destination */}
              <td className="px-4 py-3 align-middle">
                <a
                  href={url.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-(--text-secondary) hover:text-(--text-primary) transition-colors max-w-xs block truncate leading-snug"
                  title={url.originalUrl}
                >
                  {truncate(url.originalUrl, 30)}
                </a>
                {url.lastVisitedAt && (
                  <p className="text-xs text-(--text-muted) mt-1">Last: {formatRelativeDate(url.lastVisitedAt)}</p>
                )}
              </td>
              {/* Clicks */}
              <td className="px-4 py-3 align-middle">
                <span className="font-semibold text-(--text-primary)">{formatNumber(url.totalClicks)}</span>
              </td>
              {/* Status */}
              <td className="px-4 py-3 align-middle">{getStatusBadge(url)}</td>
              {/* Created */}
              <td className="px-4 py-3 align-middle text-(--text-muted)">
                <span className="leading-snug block">{formatRelativeDate(url.createdAt)}</span>
                {url.expiresAt && (
                  <p className="text-xs mt-1">Exp: {formatDate(url.expiresAt)}</p>
                )}
              </td>
              {/* Actions */}
              <td className="px-4 py-3 align-middle text-right">
                <div className="flex items-center justify-end gap-2 min-h-[32px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/analytics/${url._id}`)}
                    title="View analytics"
                  >
                    Analytics
                  </Button>
                  <div className="relative" onClick={(event) => event.stopPropagation()}>
                    <Button
                      variant="secondary"
                      size="sm"
                      type="button"
                      aria-expanded={openMenu?.id === url._id}
                      onClick={(event) => {
                        event.stopPropagation();
                        const rect = event.currentTarget.getBoundingClientRect();
                        setOpenMenu((prev) =>
                          prev?.id === url._id
                            ? null
                            : {
                                id: url._id,
                                top: rect.bottom + 8,
                                left: rect.right - 160,
                              }
                        );
                      }}
                    >
                      More
                    </Button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
      {openMenu &&
        createPortal(
          <div
            className="fixed z-50 w-40 rounded-lg border border-(--border) bg-(--card) shadow-xl p-1"
            style={{ top: `${openMenu.top}px`, left: `${openMenu.left}px` }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                const url = urls.find((item) => item._id === openMenu.id);
                if (!url) return;
                onEdit(url);
                setOpenMenu(null);
              }}
              className="w-full text-left px-3 py-2 text-sm rounded-md text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg)"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => {
                const url = urls.find((item) => item._id === openMenu.id);
                if (!url) return;
                onQR(url);
                setOpenMenu(null);
              }}
              className="w-full text-left px-3 py-2 text-sm rounded-md text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg)"
            >
              QR code
            </button>
            <button
              type="button"
              onClick={() => {
                const url = urls.find((item) => item._id === openMenu.id);
                if (!url) return;
                handleToggle(url);
                setOpenMenu(null);
              }}
              disabled={togglingId === openMenu.id}
              className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-(--bg) ${
                urls.find((item) => item._id === openMenu.id)?.isActive ? 'text-amber-600' : 'text-emerald-600'
              }`}
            >
              {togglingId === openMenu.id
                ? 'Updating...'
                : urls.find((item) => item._id === openMenu.id)?.isActive
                  ? 'Disable'
                  : 'Enable'}
            </button>
            <button
              type="button"
              onClick={() => {
                const url = urls.find((item) => item._id === openMenu.id);
                if (!url) return;
                handleDelete(url);
                setOpenMenu(null);
              }}
              disabled={deletingId === openMenu.id}
              className="w-full text-left px-3 py-2 text-sm rounded-md text-red-500 hover:bg-red-500/10"
            >
              {deletingId === openMenu.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>,
          document.body
        )}
    </div>
  );
};
