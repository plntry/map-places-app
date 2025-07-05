import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getMarkerClasses = (isSelected: boolean, className?: string) => {
  const baseClasses =
    "size-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 border-2";

  return cn(
    baseClasses,
    isSelected
      ? "bg-orange-500 border-orange-600 border-orange-700"
      : "bg-blue-500 border-blue-600",
    className
  );
};
