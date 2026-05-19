import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Links' },
  { to: '/profile', label: 'Profile' },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden lg:flex lg:flex-col border-r border-(--border) bg-(--surface) transition-all duration-200 ${
        collapsed ? 'lg:w-16' : 'lg:w-60'
      }`}
    >
      <div className="h-14 px-3 flex items-center justify-between border-b border-(--border)">
        {!collapsed && (
          <p className="text-[11px] uppercase tracking-wider text-(--text-muted)">Workspace</p>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="w-7 h-7 rounded-md border border-(--border) text-(--text-muted) hover:text-(--text-secondary)"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '>' : '<'}
        </button>
      </div>

      <div className={`px-3 py-4 ${collapsed ? 'px-2' : ''}`}>
        {!collapsed && (
          <p className="px-2 text-[11px] uppercase tracking-wider text-(--text-muted)">Navigation</p>
        )}
        <nav className={`mt-3 space-y-1 ${collapsed ? 'mt-2' : ''}`}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-2.5 py-2 text-sm rounded-lg border transition-colors ${
                  isActive
                    ? 'bg-(--bg) border-(--border) text-(--text-primary)]'
                    : 'border-transparent text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg)]'
                }`
              }
              title={item.label}
            >
              {collapsed ? item.label.slice(0, 1) : item.label}
              {!collapsed && <span className="text-[10px] text-(--text-muted)">/</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {!collapsed && (
        <div className="mt-auto px-4 py-4 border-t border-(--border)">
          <div className="rounded-lg border border-(--border) bg-(--bg) px-3 py-2 text-xs text-(--text-muted)">
            Keep links tidy. Ship fast.
          </div>
        </div>
      )}
    </aside>
  );
};
