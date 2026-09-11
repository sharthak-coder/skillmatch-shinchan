import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label className="text-xs font-black text-shin-ink uppercase tracking-wider flex items-center gap-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-2.5 rounded-2xl bg-white border-2 border-shin-ink text-shin-ink text-sm font-semibold placeholder:text-shin-ink/40 shadow-pop-sm focus:outline-none focus:ring-2 focus:ring-shin-yellow focus:border-shin-ink transition-all disabled:opacity-50 ${
            error ? 'border-shin-red ring-2 ring-red-200' : ''
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs font-bold text-shin-red">{error}</span>}
        {helperText && !error && (
          <span className="text-[11px] text-shin-ink/60">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
