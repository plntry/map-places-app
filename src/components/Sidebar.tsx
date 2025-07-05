import React from "react";
import { CalendarDays, MapPin, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTrip } from "../hooks/useTrip";
import { DayCard, ActivityCard, ToggleButton } from "@/components/sidebarComps";
import WeatherCard from "@/components/WeatherCard";
import { LANGUAGE_OPTIONS } from "@/constants/languages";
import { getUkrainianDayWord } from "@/utils/dates";

const Sidebar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const {
    trip,
    activeDay,
    setActiveDay,
    hoveredActivity,
    selectedActivity,
    setHoveredActivity,
    setSelectedActivity,
    sidebarOpen,
    toggleSidebar,
    mapLanguage,
    setMapLanguage,
  } = useTrip();

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
    setMapLanguage(languageCode);
    setShowLanguageMenu(false);
  };

  if (!trip) return null;

  return (
    <div
      className={`
        relative transition-all duration-300 ease-in-out z-40
        h-screen
        ${
          sidebarOpen
            ? "w-full md:w-96 lg:w-2/5 xl:w-1/3 2xl:w-1/4 translate-x-0"
            : "w-0 lg:w-0 -translate-x-full lg:translate-x-0 overflow-hidden"
        }
      `}
      id="sidebar"
    >
      <aside
        className={`h-screen glass-card border-r border-white/20 overflow-y-auto transition-all duration-300 ${
          !sidebarOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-label={t("sidebar.navigation")}
        role="complementary"
      >
        <div className="p-4 sm:p-6">
          {/* Header */}
          <header className="mb-6 sm:mb-8 pt-4">
            <div className="flex items-center justify-between mb-2">
              <h1
                className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight flex-1"
                id="trip-title"
              >
                {trip.trip_title}
              </h1>
              <ToggleButton
                variant="close"
                onClick={toggleSidebar}
                ariaControls="sidebar-content"
                ariaExpanded={true}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <CalendarDays
                  className="w-4 h-4 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="text-sm">
                  {t("sidebar.days_of_trip", {
                    count:
                      i18n.language === "uk"
                        ? `${trip.days.length} ${getUkrainianDayWord(
                            trip.days.length
                          )}`
                        : trip.days.length,
                  })}
                </span>
              </div>

              {/* Language Selector */}
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
            </div>
          </header>

          <div id="sidebar-content">
            {/* Weather Information */}
            <WeatherCard />

            {/* Days List */}
            <nav className="mb-6 sm:mb-8" aria-labelledby="route-heading">
              <h2
                className="text-lg font-semibold text-gray-800 mb-4"
                id="route-heading"
              >
                {t("sidebar.route")}
              </h2>
              <ul className="space-y-3" role="list">
                {trip.days.map((day) => (
                  <li key={day.id} role="listitem">
                    <DayCard
                      key={day.id}
                      day={day}
                      isActive={activeDay?.id === day.id}
                      onClick={() => setActiveDay(day)}
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
                    className="w-5 h-5 text-orange-600 flex-shrink-0"
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
                        onHover={setHoveredActivity}
                        onSelect={setSelectedActivity}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
