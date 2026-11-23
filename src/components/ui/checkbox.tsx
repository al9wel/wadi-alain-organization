import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked = false, onCheckedChange, disabled, ...props }, ref) => {
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
          className={cn(
            "size-[22px] rounded-[6px] border-[1.5px] transition-all flex items-center justify-center shrink-0",
            checked
              ? "bg-[#020066] border-[#020066] text-white"
              : "bg-white border-[#e2e2ea] hover:border-gray-400",
            className
          )}
        >
          {checked && <Check className="size-3.5 stroke-[3] text-white" />}
        </div>
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";
