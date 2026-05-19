import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ThemeToggle } from '../components/shared/ThemeToggle';
import api from '../services/api';
import { formatNumber } from '../utils/formatters';

const bento = [
  {
    title: 'Instant redirects',
    description: 'Sub-millisecond resolution with indexed lookups and CDN-friendly cache headers.',
    span: 'col-span-6 md:col-span-3',
  },
  {
    title: 'Privacy-first analytics',
    description: 'See device, OS, and country without storing IPs or personal data.',
    span: 'col-span-6 md:col-span-3',
  },
  {
    title: 'Custom aliases',
    description: 'Create memorable short links with guardrails and validation.',
    span: 'col-span-6 md:col-span-2',
  },
  {
    title: 'Expiry controls',
    description: 'Sunset links automatically with precise expiration rules.',
    span: 'col-span-6 md:col-span-2',
  },
  {
    title: 'QR exports',
    description: 'Generate downloadable QR codes with one click.',
    span: 'col-span-6 md:col-span-2',
  },
];

export const LandingPage = () => {
  const { isAuthenticated } = useAuthStore();
  const [overview, setOverview] = useState(null);
  const [isLoadingOverview, setIsLoadingOverview] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchOverview = async () => {
      setIsLoadingOverview(true);
      try {
        const { data } = await api.get('/api/public/overview');
        if (!cancelled) setOverview(data.data);
      } catch {
        if (!cancelled) setOverview(null);
      } finally {
        if (!cancelled) setIsLoadingOverview(false);
      }
    };

    fetchOverview();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-(--bg) surface-grid">
      <header className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Hop Lynk Logo" className="w-10 h-10 object-contain rounded" />
          <span className="font-semibold text-lg text-(--text-primary)">Hop Lynk</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="px-4 py-2 text-sm font-semibold rounded-lg btn-gradient text-white"
              id="landing-dashboard-btn"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-2 text-sm font-medium text-(--text-secondary) hover:text-(--text-primary) transition-colors"
                id="landing-login-btn"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-semibold rounded-lg btn-gradient text-white"
                id="landing-signup-btn"
              >
                Start free
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-20">
        <section className="grid lg:grid-cols-2 gap-10 items-center pt-10 pb-14">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-(--text-muted)">Productive links</p>
            <h1 className="text-4xl sm:text-5xl font-semibold leading-tight mt-4 text-(--text-primary)">
              A URL workspace that stays sharp as you scale.
            </h1>
            <p className="text-base sm:text-lg text-(--text-secondary) mt-4 max-w-lg">
              Shorten, tag, and measure links with a clean dashboard that feels like part of your product stack.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/signup"
                id="hero-cta-signup"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg btn-gradient text-white"
              >
                Create account
              </Link>
              <Link
                to="/login"
                id="hero-cta-login"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg border border-(--border) text-(--text-primary) hover:bg-(--surface) transition-colors"
              >
                View dashboard
              </Link>
            </div>
            <div className="mt-6 flex items-center gap-4 text-xs text-(--text-muted)">
              <span className="px-2 py-1 rounded border border-(--border) bg-(--surface)">No credit card</span>
              <span className="px-2 py-1 rounded border border-(--border) bg-(--surface)">2 min setup</span>
            </div>
          </div>

          <div className="bg-(--card) border border-(--border) rounded-xl p-5 shadow-xl">
            <div className="flex items-center justify-between text-xs text-(--text-muted)">
              <span>Overview</span>
              <span>Last 7 days</span>
            </div>
            <div className="mt-4 rounded-lg border border-(--border) bg-(--bg) p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-(--text-muted)">Active links</p>
                  <p className="text-2xl font-semibold text-(--text-primary)">
                    {isLoadingOverview ? '—' : formatNumber(overview?.activeLinks || 0)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-(--text-muted)">Clicks</p>
                  <p className="text-2xl font-semibold text-(--text-primary)">
                    {isLoadingOverview ? '—' : formatNumber(overview?.totalClicks || 0)}
                  </p>
                </div>
              </div>
              <div className="mt-4 rounded-md border border-(--border) bg-(--surface) px-4 py-3">
                <p className="text-xs text-(--text-muted)">Clicks in the last 7 days</p>
                <p className="text-lg font-semibold text-(--text-primary) mt-1">
                  {isLoadingOverview ? '—' : formatNumber(overview?.clicksLast7Days || 0)}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-(--border) bg-(--surface) p-3">
                <p className="text-xs text-(--text-muted)">Top referrer</p>
                <p className="text-sm font-medium text-(--text-primary)">
                  {isLoadingOverview ? '—' : overview?.topReferrer || 'Direct'}
                </p>
              </div>
              <div className="rounded-lg border border-(--border) bg-(--surface) p-3">
                <p className="text-xs text-(--text-muted)">Top country</p>
                <p className="text-sm font-medium text-(--text-primary)">
                  {isLoadingOverview ? '—' : overview?.topCountry || 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-14">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-(--text-primary)">Product preview</h2>
            <span className="text-xs text-(--text-muted)">Clean, focused analytics</span>
          </div>
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-(--card) border border-(--border) rounded-xl p-5">
              <div className="flex items-center justify-between text-xs text-(--text-muted)">
                <span>Clicks over time</span>
                <span>30 days</span>
              </div>
              <div className="mt-4 h-40 rounded-lg border border-(--border) bg-(--bg)" />
            </div>
            <div className="bg-(--card) border border-(--border) rounded-xl p-5">
              <p className="text-xs text-(--text-muted)">Totals</p>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-(--text-secondary)">Total links</span>
                  <span className="text-(--text-primary)">
                    {isLoadingOverview ? '—' : formatNumber(overview?.totalUrls || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-(--text-secondary)">Active links</span>
                  <span className="text-(--text-primary)">
                    {isLoadingOverview ? '—' : formatNumber(overview?.activeLinks || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-(--text-secondary)">Clicks (7d)</span>
                  <span className="text-(--text-primary)">
                    {isLoadingOverview ? '—' : formatNumber(overview?.clicksLast7Days || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-16">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-(--text-primary)">Built for real teams</h2>
            <span className="text-xs text-(--text-muted)">Product-grade UI, not marketing fluff</span>
          </div>
          <div className="grid grid-cols-6 gap-4">
            {bento.map((item) => (
              <div
                key={item.title}
                className={`${item.span} bg-(--card) border border-(--border) rounded-xl p-5 hover:border-(--color-brand-500)]/40 transition-colors`}
              >
                <p className="text-sm font-semibold text-(--text-primary)">{item.title}</p>
                <p className="text-xs text-(--text-muted) mt-2">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-(--card) border border-(--border) rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-(--text-primary)">Ready to tidy your links?</h3>
            <p className="text-sm text-(--text-muted) mt-1">Spin up your workspace in minutes.</p>
          </div>
          <Link
            to="/signup"
            className="px-4 py-2 text-sm font-semibold rounded-lg btn-gradient text-white"
          >
            Get started
          </Link>
        </section>
      </main>

      <footer className="text-center pb-8 text-xs text-(--text-muted)">
        © {new Date().getFullYear()} Hop Lynk. Built for focused teams.
      </footer>
    </div>
  );
};
