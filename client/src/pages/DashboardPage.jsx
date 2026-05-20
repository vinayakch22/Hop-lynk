import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { useUrls } from '../hooks/useUrls';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { UrlTable } from '../components/urls/UrlTable';
import { CreateUrlModal } from '../components/urls/CreateUrlModal';
import { EditUrlModal } from '../components/urls/EditUrlModal';
import { QRCodeModal } from '../components/urls/QRCodeModal';
import { UrlPagination } from '../components/urls/UrlPagination';
import { SkeletonTable, SkeletonStatCard } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { formatNumber } from '../utils/formatters';

const StatPill = ({ label, value, isLoading }) => (
  <div className="bg-(--card) border border-(--border) rounded-xl px-4 py-3 w-full">
    {isLoading ? (
      <SkeletonStatCard />
    ) : (
      <>
        <p className="text-xl font-semibold text-(--text-primary)">{formatNumber(value)}</p>
        <p className="text-[11px] uppercase tracking-wider text-(--text-muted) mt-0.5">{label}</p>
      </>
    )}
  </div>
);

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const { urls, setUrls, pagination, stats, isLoading, fetchUrls, createUrl, updateUrl, deleteUrl, toggleUrl } = useUrls();

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [editUrl, setEditUrl] = useState(null);
  const [qrUrl, setQrUrl] = useState(null);

  const loadUrls = useCallback((page = currentPage, q = search) => {
    fetchUrls({ page, limit: 10, search: q });
  }, [fetchUrls, currentPage, search]);

  useEffect(() => {
    loadUrls(1, '');
  }, []);

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearch(q);
    setCurrentPage(1);
    fetchUrls({ page: 1, limit: 10, search: q });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchUrls({ page, limit: 10, search });
  };

  const handleCreated = async (payload) => {
    const newUrl = await createUrl(payload);
    loadUrls(1, search);
    return newUrl;
  };

  const handleUpdated = async (id, payload) => {
    const updated = await updateUrl(id, payload);
    setUrls((prev) => prev.map((u) => (u._id === id ? updated : u)));
  };

  const handleDeleted = async (id) => {
    await deleteUrl(id);
    loadUrls(currentPage, search);
  };

  const handleToggled = async (id) => {
    const updated = await toggleUrl(id);
    setUrls((prev) => prev.map((u) => (u._id === id ? updated : u)));
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6 animate-fade-in-up">
        <h1 className="text-2xl font-semibold text-(--text-primary)">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
          {user?.name || 'there'}
        </h1>
        <p className="text-sm text-(--text-muted) mt-1">Track and maintain your active links</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <StatPill label="Total URLs" value={stats.total} isLoading={isLoading} />
        <StatPill label="Active links" value={stats.activeCount} isLoading={isLoading} />
        <StatPill label="Total clicks" value={stats.totalClicks} isLoading={isLoading} />
      </div>

      {/* Main Card */}
      <div className="bg-(--card) border border-(--border) rounded-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-4 py-3 sm:px-5 sm:py-4 border-b border-(--border)">
          <div className="relative flex-1 w-full">
            <input
              id="dashboard-search"
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search links or aliases"
              className="w-full px-3.5 py-2 text-sm bg-(--bg) border border-(--border) rounded-lg text-(--text-primary) placeholder:text-(--text-muted) input-ring focus:border-brand-500 transition-all"
            />
          </div>
          <Button
            onClick={() => setShowCreate(true)}
            id="create-url-btn"
            className="w-full sm:w-auto shrink-0"
          >
            Create link
          </Button>
        </div>

        <div className="p-4 sm:p-5">
          {isLoading ? (
            <SkeletonTable rows={5} />
          ) : (
            <>
              <UrlTable
                urls={urls}
                onEdit={setEditUrl}
                onDelete={handleDeleted}
                onToggle={handleToggled}
                onQR={setQrUrl}
                onCreate={() => setShowCreate(true)}
              />
              <div className="mt-6">
                <UrlPagination pagination={pagination} onPageChange={handlePageChange} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateUrlModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={handleCreated}
      />
      <EditUrlModal
        isOpen={!!editUrl}
        onClose={() => setEditUrl(null)}
        url={editUrl}
        onUpdated={handleUpdated}
      />
      <QRCodeModal
        isOpen={!!qrUrl}
        onClose={() => setQrUrl(null)}
        url={qrUrl}
      />
    </DashboardLayout>
  );
};
