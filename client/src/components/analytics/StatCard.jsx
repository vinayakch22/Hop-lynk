import { formatNumber } from '../../utils/formatters';

export const StatCard = ({ label, value, icon, color = 'brand', sublabel }) => {
  const colors = {
    brand: 'text-(--color-brand-600) bg-(--color-brand-500)]/10 border-(--color-brand-500)]/20',
    accent: 'text-(--color-brand-600) bg-(--color-brand-500)]/10 border-(--color-brand-500)]/20',
    green: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-600 bg-amber-500/10 border-amber-500/20',
  };

  return (
    <div className="bg-(--card) border border-(--border) rounded-xl p-5 space-y-3">
      <div className={`w-9 h-9 rounded-lg border ${colors[color]} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-xl font-semibold text-(--text-primary)">
          {typeof value === 'number' ? formatNumber(value) : value}
        </p>
        <p className="text-[11px] uppercase tracking-wider text-(--text-muted) mt-1">{label}</p>
        {sublabel && <p className="text-xs text-(--text-muted) mt-1">{sublabel}</p>}
      </div>
    </div>
  );
};
