import { Link } from 'react-router-dom';

export const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen bg-(--bg) surface-grid flex flex-col items-center justify-center p-4 sm:p-6">
      <Link to="/" className="flex items-center gap-2 mb-8" id="auth-logo">
        <img src="/logo.png" alt="Hop Lynk Logo" className="w-10 h-10 object-contain rounded" />
        <span className="font-semibold text-xl text-(--text-primary)">Hop Lynk</span>
      </Link>

      <div className="w-full max-w-md bg-(--card) border border-(--border) rounded-xl p-5 sm:p-7 shadow-xl animate-fade-in-up">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-(--text-primary)">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-(--text-muted)">{subtitle}</p>}
        </div>
        {children}
      </div>

      <p className="mt-8 text-xs text-(--text-muted)">
        © {new Date().getFullYear()} Hop Lynk. All rights reserved.
      </p>
    </div>
  );
};
