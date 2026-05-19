import { forwardRef } from 'react';

export const Input = forwardRef(
  ({ label, error, hint, leftIcon, rightElement, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-(--text-secondary)"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-(--text-muted) pointer-events-none flex items-center">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full px-3.5 py-2.5 text-sm
              bg-(--surface) border rounded-lg
              text-(--text-primary) placeholder:text-(--text-muted)]
              transition-all duration-200 input-ring
              ${error ? 'border-red-500/70' : 'border-(--border) focus:border-(--color-brand-500)]'}
              ${leftIcon ? 'pl-10' : ''}
              ${rightElement ? 'pr-10' : ''}
              ${className}
            `}
            {...props}
          />
          {rightElement && (
            <span className="absolute right-3 flex items-center">{rightElement}</span>
          )}
        </div>
        {error && <p className="text-xs text-red-400 flex items-center gap-1">⚠ {error}</p>}
        {hint && !error && <p className="text-xs text-(--text-muted)">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
