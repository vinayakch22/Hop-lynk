import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAnalytics } from '../hooks/useAnalytics';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { StatCard } from '../components/analytics/StatCard';
import { ClicksChart } from '../components/analytics/ClicksChart';
import { BrowserChart } from '../components/analytics/BrowserChart';
import { DeviceChart } from '../components/analytics/DeviceChart';
import { CountryChart } from '../components/analytics/CountryChart';
import { Skeleton } from '../components/ui/Skeleton';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { formatRelativeDate, formatDate, truncate, buildShortUrl } from '../utils/formatters';
import { toast } from 'react-hot-toast';

const ChartCard = ({ title, children }) => (
  <div className="bg-(--card) border border-(--border) rounded-xl p-5">
    <h3 className="text-xs font-semibold text-(--text-muted) uppercase tracking-wider mb-4">{title}</h3>
    {children}
  </div>
);

export const AnalyticsPage = () => {
  const { urlId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useAnalytics(urlId);

  const handleCopy = async () => {
    if (!data?.url) return;
    try {
      await navigator.clipboard.writeText(buildShortUrl(data.url.shortCode));
      toast.success('Copied to clipboard!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-red-400 text-lg font-semibold mb-4">{error}</p>
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>← Back to Dashboard</Button>
        </div>
      </DashboardLayout>
    );
  }

  const url = data?.url;
  const stats = data?.stats;
  const charts = data?.charts;
  const recent = data?.recent;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6 animate-fade-in-up">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="mb-4 -ml-1"
          id="analytics-back-btn"
        >
          Back to Dashboard
        </Button>

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-start gap-3">
              <h1 className="text-2xl font-semibold text-(--text-primary)">
                /r/{url?.shortCode}
              </h1>
              {url?.isActive ? (
                <Badge variant="active">● Active</Badge>
              ) : (
                <Badge variant="inactive">● Inactive</Badge>
              )}
              {url?.expiresAt && new Date() > new Date(url.expiresAt) && (
                <Badge variant="expired">⏰ Expired</Badge>
              )}
            </div>
            <div className="flex items-center gap-3 mt-2">
              <a
                href={url?.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-(--text-muted) hover:text-(--text-secondary) transition-colors max-w-xl truncate"
                title={url?.originalUrl}
              >
                {truncate(url?.originalUrl, 60)}
              </a>
              <button
                onClick={handleCopy}
                className="text-(--text-muted) hover:text-(--text-secondary) transition-colors shrink-0"
                title="Copy short URL"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            {url?.createdAt && (
              <p className="text-xs text-(--text-muted) mt-1">Created {formatDate(url.createdAt)}{url.expiresAt && ` · Expires ${formatDate(url.expiresAt)}`}</p>
            )}
          </>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {isLoading ? (
          <>
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </>
        ) : (
          <>
            <StatCard
              label="Total Clicks"
              value={stats?.totalClicks ?? 0}
              color="brand"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>}
            />
            <StatCard
              label="Countries Reached"
              value={stats?.uniqueCountries ?? 0}
              color="accent"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard
              label="Last Visited"
              value={stats?.lastVisitedAt ? formatRelativeDate(stats.lastVisitedAt) : 'Never'}
              color="green"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
          </>
        )}
      </div>

      {/* Charts Grid */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-80 rounded-xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <ChartCard title="Clicks over time">
            <ClicksChart data={charts?.clicksByDay} />
          </ChartCard>

          {/* Browser + Device Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ChartCard title="Browsers">
              <BrowserChart data={charts?.byBrowser} />
            </ChartCard>
            <ChartCard title="Devices">
              <DeviceChart data={charts?.byDevice} />
            </ChartCard>
          </div>

          {/* OS + Country Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ChartCard title="Operating systems">
              <BrowserChart data={charts?.byOS} />
            </ChartCard>
            <ChartCard title="Top countries">
              <CountryChart data={charts?.byCountry} />
            </ChartCard>
          </div>

          {/* Recent Clicks Table */}
          {recent && recent.length > 0 && (
            <div className="bg-(--card) border border-(--border) rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-(--border)">
                <h3 className="text-xs font-semibold text-(--text-muted) uppercase tracking-wider">Recent clicks</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-(--border)">
                      {['Time', 'Browser', 'OS', 'Device', 'Country', 'Referrer'].map((h) => (
                        <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold text-(--text-muted) uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-(--border)">
                    {recent.map((click) => (
                      <tr key={click._id} className="table-row-hover">
                        <td className="px-4 py-2.5 text-(--text-muted) whitespace-nowrap">{formatRelativeDate(click.timestamp)}</td>
                        <td className="px-4 py-2.5 text-(--text-secondary)">{click.browser}</td>
                        <td className="px-4 py-2.5 text-(--text-secondary)">{click.os}</td>
                        <td className="px-4 py-2.5 text-(--text-secondary)">{click.device}</td>
                        <td className="px-4 py-2.5 text-(--text-secondary)">{click.country}</td>
                        <td className="px-4 py-2.5 text-(--text-muted) max-w-32 truncate">{click.referrer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};
