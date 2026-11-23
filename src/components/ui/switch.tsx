import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "size"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: "default" | "sm";
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked = false, onCheckedChange, disabled, size = "default", ...props }, ref) => {
    const isSm = size === "sm";

    return (
      <label
        className={cn(
          "relative inline-flex items-center select-none",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        )}
      >
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          ref={ref}
          {...props}
        />
        <div
          dir="ltr"
          className={cn(
            "rounded-full transition-colors relative flex items-center p-0.5",
            isSm ? "h-5 w-9" : "h-6 w-11",
            checked
              ? "bg-primary"
              : "bg-[#dfe1ea] dark:bg-muted-foreground/35",
            className
          )}
        >
          <div
            className={cn(
              "rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out",
              isSm ? "size-4" : "size-5",
              checked ? "translate-x-0" : isSm ? "translate-x-4" : "translate-x-5"
            )}
          />
        </div>
      </label>
    );
  }
);
Switch.displayName = "Switch";
