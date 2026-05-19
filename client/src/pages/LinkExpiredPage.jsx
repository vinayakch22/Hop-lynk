import { Link } from 'react-router-dom';
import { ThemeToggle } from '../components/shared/ThemeToggle';

export const LinkExpiredPage = () => {
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
              <p className="text-xs uppercase tracking-[0.2em] text-(--text-muted)">Link expired</p>
              <span className="text-[11px] uppercase tracking-wider px-2 py-1 rounded border border-(--border) text-(--text-muted)">410</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-(--text-primary) mt-4">
              This link is no longer active
            </h1>
            <p className="text-sm sm:text-base text-(--text-secondary) mt-3">
              The link expired or was deactivated by its owner. Reach out for a new link or visit the dashboard to manage your own.
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
                <p className="text-xs uppercase tracking-wider text-(--text-muted)">Why it expired</p>
                <ul className="mt-2 space-y-1 text-sm text-(--text-secondary)">
                  <li>Expiration date passed</li>
                  <li>Owner deactivated the link</li>
                  <li>Workspace policy disabled it</li>
                </ul>
              </div>
              <div className="rounded-lg border border-(--border) bg-(--surface) p-4">
                <p className="text-xs uppercase tracking-wider text-(--text-muted)">What you can do</p>
                <ul className="mt-2 space-y-1 text-sm text-(--text-secondary)">
                  <li>Request a new link</li>
                  <li>Open the Hop Lynk dashboard</li>
                  <li>Create a replacement</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-(--card) border border-(--border) rounded-xl p-6 shadow-xl">
            <div className="rounded-lg border border-(--border) bg-(--surface) p-5">
              <p className="text-xs uppercase tracking-wider text-(--text-muted)">Activity window</p>
              <p className="text-sm text-(--text-secondary) mt-2">
                Hop Lynk links can expire by date or when usage limits are reached.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-(--text-muted)">
                <span className="px-2 py-1 rounded border border-(--border) bg-(--bg)">Expiry rules</span>
                <span className="px-2 py-1 rounded border border-(--border) bg-(--bg)">Owner control</span>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-(--border) bg-(--surface) p-5">
              <p className="text-xs uppercase tracking-wider text-(--text-muted)">Status</p>
              <p className="text-sm text-(--text-secondary) mt-2">Link inactive</p>
              <p className="text-xs text-(--text-muted) mt-1">Try a fresh Hop Lynk or visit home.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
