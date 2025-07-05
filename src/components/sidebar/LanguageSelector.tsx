import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { LANGUAGE_OPTIONS } from "@/constants/languages";
import { LanguageSelectorProps } from "@/types/Sidebar";

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  mapLanguage,
  onLanguageSelect,
}) => {
  const { t } = useTranslation();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target as Node)
      ) {
        setShowLanguageMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (languageCode: string) => {
    onLanguageSelect(languageCode);
    setShowLanguageMenu(false);
  };

  return (
    <div className="relative" ref={languageMenuRef}>
      <button
        onClick={() => setShowLanguageMenu(!showLanguageMenu)}
        className="flex items-center gap-2 glass-button-neutral min-h-0 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-800 transition-all duration-200 shadow-sm"
        aria-label="Змінити мову карти"
        aria-expanded={showLanguageMenu}
        aria-haspopup="listbox"
      >
        <span>
          {LANGUAGE_OPTIONS.find((l) => l.code === mapLanguage)?.flag}
        </span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${
            showLanguageMenu ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {showLanguageMenu && (
        <div className="absolute top-full right-0 mt-1 glass-card-neutral rounded-lg shadow-xl border border-white/20 min-w-[180px] z-30">
          <div className="p-1.5">
            <div className="text-xs font-medium text-gray-600 px-2 py-1.5 border-b border-white/20">
              {t("sidebar.map_language")}
            </div>
            <ul
              role="listbox"
              aria-label={t("sidebar.choose_map_language")}
              className="max-h-48 overflow-y-auto"
            >
              {LANGUAGE_OPTIONS.map((lang) => (
                <li key={lang.code} role="option">
                  <button
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded-md transition-colors duration-200 min-h-0 ${
                      mapLanguage === lang.code
                        ? "bg-orange-100 text-orange-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    aria-selected={mapLanguage === lang.code}
                  >
                    <span className="text-base" aria-hidden="true">
                      {lang.flag}
                    </span>
                    <span className="truncate">{lang.name}</span>
                    {mapLanguage === lang.code && (
                      <span
                        className="ml-auto text-orange-600"
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
