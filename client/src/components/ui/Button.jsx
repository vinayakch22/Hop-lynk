import { forwardRef } from 'react';

const variants = {
  primary:
    'btn-gradient text-white font-semibold shadow-sm',
  secondary:
    'bg-(--surface) border border-(--border) text-(--text-primary) hover:bg-(--bg) transition-colors',
  ghost:
    'bg-transparent text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--border)/60 transition-colors',
  danger:
    'bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 transition-colors',
  outline:
    'border border-(--border) text-(--text-secondary) hover:border-(--text-primary) hover:text-(--text-primary) transition-colors',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-2.5 text-base rounded-lg',
  xl: 'px-7 py-3 text-base rounded-xl',
  icon: 'p-2 rounded-md',
};

export const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      className = '',
      isLoading = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center gap-2 font-medium
          cursor-pointer select-none
          disabled:opacity-50 disabled:cursor-not-allowed
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-brand-500) focus-visible:ring-offset-2
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4 flex-shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
