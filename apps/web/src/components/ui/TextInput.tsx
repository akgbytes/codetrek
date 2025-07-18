import React from "react";
import { Label } from "@repo/ui/components/label";
import { Input } from "@repo/ui/components/input";
import { Eye, EyeOff } from "lucide-react";

interface TextInputProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  placeholder?: string;
  type?: string;
  error?: string;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}

const TextInput = ({
  id,
  label,
  icon,
  placeholder,
  type = "text",
  error,
  showPasswordToggle = false,
  showPassword,
  onTogglePassword,
  inputProps,
}: TextInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-zinc-50">
        {label}
      </Label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-300/70">
            {icon}
          </div>
        )}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          className={`w-full pr-4 py-3 border rounded border-white/10 bg-zinc-900 text-zinc-200 focus-visible:ring-zinc-50 focus-visible:ring-[1px] ${icon ? "pl-10" : ""}`}
          {...inputProps}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-5 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-zinc-50"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default TextInput;
