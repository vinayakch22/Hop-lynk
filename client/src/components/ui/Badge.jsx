const variants = {
  active: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/25',
  inactive: 'bg-red-500/10 text-red-500 border border-red-500/25',
  expired: 'bg-amber-500/10 text-amber-500 border border-amber-500/25',
  brand: 'bg-(--color-brand-500)/10 text-(--color-brand-600) border border-(--color-brand-500)/25',
  neutral: 'bg-(--bg) text-(--text-secondary) border border-(--border)',
};

export const Badge = ({ children, variant = 'neutral', className = '' }) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2.5 py-0.5
        text-xs font-medium rounded-md
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};
