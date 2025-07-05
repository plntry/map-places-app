import { RefObject } from "react";
import { Activity } from "./Trip";

export interface UseMapMarkersProps {
  mapInstanceRef: RefObject<google.maps.Map | null>;
  activities: Activity[];
  selectedActivity: number | null;
  hoveredActivity: number | null;
  onActivitySelect: (activityId: number) => void;
  onActivityHover: (activityId: number | null) => void;
}
