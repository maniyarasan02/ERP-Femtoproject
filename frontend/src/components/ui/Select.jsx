import React from "react";
import { cn } from "../../lib/utils";

const Select = React.forwardRef(({ className, children, error, ...props }, ref) => {
    return (
        <div className="relative">
            <select
                className={cn(
                    "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
                    error && "border-red-500 focus:ring-red-500 focus:border-red-500",
                    className
                )}
                ref={ref}
                {...props}
            >
                {children}
            </select>
            {/* Custom arrow could go here if appearance-none is used, but native is fine for now */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
            </div>
            {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
        </div>
    );
});
Select.displayName = "Select";

export { Select };
