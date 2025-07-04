import React from "react";
import { CalendarDays, MapPin, X, Globe, ChevronDown } from "lucide-react";
import { Day } from "../types/trip";
import DayCard from "./DayCard";
import ActivityCard from "./ActivityCard";

// Language options for Google Maps
const LANGUAGE_OPTIONS = [
  { code: "uk", name: "Українська", flag: "🇺🇦" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
];

interface SidebarProps {
  tripTitle: string;
  days: Day[];
  activeDay: Day | null;
  onDaySelect: (day: Day) => void;
  hoveredActivity: number | null;
  selectedActivity: number | null;
  onActivityHover: (activityId: number | null) => void;
  onActivitySelect: (activityId: number | null) => void;
  isCollapsed?: boolean;
  onToggleCollapse: () => void;
  mapLanguage: string;
  onLanguageChange: (languageCode: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  tripTitle,
  days,
  activeDay,
  onDaySelect,
  hoveredActivity,
  selectedActivity,
  onActivityHover,
  onActivitySelect,
  isCollapsed = false,
  onToggleCollapse,
  mapLanguage,
  onLanguageChange,
}) => {
  const [showLanguageMenu, setShowLanguageMenu] = React.useState(false);
  const languageMenuRef = React.useRef<HTMLDivElement>(null);

  // Close language menu when clicking outside
  React.useEffect(() => {
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
    onLanguageChange(languageCode);
    setShowLanguageMenu(false);
  };

  return (
    <aside
      className={`h-screen glass-card border-r border-white/20 overflow-y-auto transition-all duration-300 ${
        isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-label="Бічна панель навігації"
      role="complementary"
    >
      <div className="p-4 sm:p-6">
        {/* Header */}
        <header className="mb-6 sm:mb-8 pt-12 lg:pt-4">
          <div className="flex items-center justify-between mb-2">
            <h1
              className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight flex-1"
              id="trip-title"
            >
              {tripTitle}
            </h1>
            <button
              onClick={onToggleCollapse}
              className="flex items-center justify-center w-8 h-8 rounded-lg glass-button-neutral ml-2 flex-shrink-0"
              aria-label="Закрити бічну панель"
              aria-expanded={true}
              aria-controls="sidebar-content"
            >
              <X className="w-4 h-4 text-gray-700" aria-hidden="true" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <CalendarDays
                className="w-4 h-4 flex-shrink-0"
                aria-hidden="true"
              />
              <span className="text-sm">{days.length} днів подорожі</span>
            </div>

            {/* Language Selector */}
            <div className="relative" ref={languageMenuRef}>
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center gap-2 glass-button-neutral rounded-lg px-2 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-800 transition-all duration-200 shadow-sm"
                aria-label="Змінити мову карти"
                aria-expanded={showLanguageMenu}
                aria-haspopup="listbox"
              >
                <Globe className="w-3 h-3" aria-hidden="true" />
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
                      Мова карти
                    </div>
                    <ul
                      role="listbox"
                      aria-label="Вибір мови карти"
                      className="max-h-48 overflow-y-auto"
                    >
                      {LANGUAGE_OPTIONS.map((lang) => (
                        <li key={lang.code} role="option">
                          <button
                            onClick={() => handleLanguageSelect(lang.code)}
                            className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded-md transition-colors duration-200 ${
                              mapLanguage === lang.code
                                ? "bg-blue-100 text-blue-700 font-medium"
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
                                className="ml-auto text-blue-600"
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
          </div>
        </header>

        <div id="sidebar-content">
          {/* Days List */}
          <nav className="mb-6 sm:mb-8" aria-labelledby="route-heading">
            <h2
              className="text-lg font-semibold text-gray-800 mb-4"
              id="route-heading"
            >
              Маршрут
            </h2>
            <ul className="space-y-3" role="list">
              {days.map((day) => (
                <li key={day.id} role="listitem">
                  <DayCard
                    key={day.id}
                    day={day}
                    isActive={activeDay?.id === day.id}
                    onClick={() => onDaySelect(day)}
                  />
                </li>
              ))}
            </ul>
          </nav>

          {/* Active Day Activities */}
          {activeDay && (
            <section
              className="animate-fade-in"
              aria-labelledby="activities-heading"
            >
              <div className="flex items-center gap-2 mb-4">
                <MapPin
                  className="w-5 h-5 text-blue-600 flex-shrink-0"
                  aria-hidden="true"
                />
                <h2
                  className="text-lg font-semibold text-gray-800 leading-tight"
                  id="activities-heading"
                >
                  {activeDay.title}
                </h2>
              </div>
              <ul
                className="space-y-4 pb-4"
                role="list"
                aria-label="Список активностей"
              >
                {activeDay.activities.map((activity) => (
                  <li key={activity.id} role="listitem">
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      isHovered={hoveredActivity === activity.id}
                      isSelected={selectedActivity === activity.id}
                      onHover={onActivityHover}
                      onSelect={onActivitySelect}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
