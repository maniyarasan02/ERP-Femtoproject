import React from "react";
import { cn } from "../../lib/utils";

const Button = React.forwardRef(({ className, variant = "primary", size = "default", ...props }, ref) => {
    const variants = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
        secondary: "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 shadow-sm",
        ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
        danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
        outline: "border border-indigo-600 text-indigo-600 hover:bg-indigo-50",
    };

    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-lg",
        icon: "h-10 w-10",
    };

    return (
        <button
            ref={ref}
            className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
});

Button.displayName = "Button";

export { Button };
