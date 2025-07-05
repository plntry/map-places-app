import React from "react";
import { Menu, X } from "lucide-react";

interface ToggleButtonProps {
  variant: "open" | "close";
  onClick: () => void;
  ariaControls?: string;
  ariaExpanded?: boolean;
  className?: string;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  variant,
  onClick,
  ariaControls,
  ariaExpanded,
  className = "",
}) => {
  const isOpen = variant === "open";

  return (
    <button
      onClick={onClick}
      className={
        isOpen
          ? `fixed top-[104px] left-2.5 z-50 glass-button-neutral rounded-lg shadow-lg p-3 transition-all duration-300 ${className}`
          : `flex items-center justify-center w-8 h-8 rounded-lg glass-button-neutral ml-2 flex-shrink-0 ${className}`
      }
      aria-label={isOpen ? "Відкрити бічну панель" : "Закрити бічну панель"}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
    >
      {isOpen ? (
        <Menu className="w-6 h-6 text-gray-700" aria-hidden="true" />
      ) : (
        <X className="w-4 h-4 text-gray-700" aria-hidden="true" />
      )}
    </button>
  );
};

export default ToggleButton;
