import React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef(({ className, type, error, ...props }, ref) => {
    return (
        <div className="relative">
            <input
                type={type}
                className={cn(
                    "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50",
                    error && "border-red-500 focus:ring-red-500 focus:border-red-500",
                    className
                )}
                ref={ref}
                {...props}
            />
            {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
        </div>
    );
});
Input.displayName = "Input";

export { Input };
