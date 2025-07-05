import { Day, Trip } from "@/types/Trip";

export interface SidebarProps {
  mapInstanceRef: React.RefObject<google.maps.Map | null>;
}

export interface SidebarHeaderProps {
  tripTitle: string;
  daysCount: number;
  mapLanguage: string;
  onToggleSidebar: () => void;
  onLanguageSelect: (languageCode: string) => void;
}

export interface LanguageSelectorProps {
  mapLanguage: string;
  onLanguageSelect: (languageCode: string) => void;
}

export interface DaysNavigationProps {
  days: Day[];
  activeDay: Day | null;
  onDaySelect: (day: Day) => void;
}

export interface ActivitiesSectionProps {
  activeDay: Day;
  hoveredActivity: number | null;
  selectedActivity: number | null;
  onActivityHover: (activityId: number | null) => void;
  onActivitySelect: (activityId: number | null) => void;
}

export interface SidebarContentProps {
  trip: Trip;
  activeDay: Day | null;
  hoveredActivity: number | null;
  selectedActivity: number | null;
  onDaySelect: (day: Day) => void;
  onActivityHover: (activityId: number | null) => void;
  onActivitySelect: (activityId: number | null) => void;
  distance: number | null;
  duration: number | null;
  loading: boolean;
  enabled: boolean;
  selectedStep: number | null;
  hoveredStep: number | null;
}
