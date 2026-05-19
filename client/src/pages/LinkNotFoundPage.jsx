import { Link } from 'react-router-dom';
import { ThemeToggle } from '../components/shared/ThemeToggle';

export const LinkNotFoundPage = () => {
  return (
    <div className="min-h-screen bg-(--bg) surface-grid">
      <header className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Hop Lynk logo" className="w-10 h-10 object-contain rounded" />
          <span className="font-semibold text-lg text-(--text-primary)">Hop Lynk</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="bg-(--card) border border-(--border) rounded-xl p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-(--text-muted)">Link not found</p>
              <span className="text-[11px] uppercase tracking-wider px-2 py-1 rounded border border-(--border) text-(--text-muted)">404</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-(--text-primary) mt-4">
              This link does not exist
            </h1>
            <p className="text-sm sm:text-base text-(--text-secondary) mt-3">
              The short link you followed is invalid or was removed. If you received it from someone else, ask them to share a new link.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/"
                className="px-4 py-2 text-sm font-semibold rounded-lg btn-gradient text-white"
              >
                Go to home
              </Link>
              <Link
                to="/dashboard"
                className="px-4 py-2 text-sm font-semibold rounded-lg border border-(--border) text-(--text-primary) hover:bg-(--surface) transition-colors"
              >
                Open dashboard
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-(--border) bg-(--surface) p-4">
                <p className="text-xs uppercase tracking-wider text-(--text-muted)">What happened</p>
                <ul className="mt-2 space-y-1 text-sm text-(--text-secondary)">
                  <li>Short code was mistyped</li>
                  <li>Link was deleted by owner</li>
                  <li>Short code never existed</li>
                </ul>
              </div>
              <div className="rounded-lg border border-(--border) bg-(--surface) p-4">
                <p className="text-xs uppercase tracking-wider text-(--text-muted)">Next steps</p>
                <ul className="mt-2 space-y-1 text-sm text-(--text-secondary)">
                  <li>Ask for a fresh link</li>
                  <li>Check the original message</li>
                  <li>Create a new Hop Lynk</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-(--card) border border-(--border) rounded-xl p-6 shadow-xl">
            <div className="rounded-lg border border-(--border) bg-(--surface) p-5">
              <p className="text-xs uppercase tracking-wider text-(--text-muted)">Quick create</p>
              <p className="text-sm text-(--text-secondary) mt-2">
                Shorten a new URL and keep track of every click from your dashboard.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-(--text-muted)">
                <span className="px-2 py-1 rounded border border-(--border) bg-(--bg)">Private analytics</span>
                <span className="px-2 py-1 rounded border border-(--border) bg-(--bg)">Custom aliases</span>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-(--border) bg-(--surface) p-5">
              <p className="text-xs uppercase tracking-wider text-(--text-muted)">Status</p>
              <p className="text-sm text-(--text-secondary) mt-2">Short link unavailable</p>
              <p className="text-xs text-(--text-muted) mt-1">Try again or open your workspace.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
