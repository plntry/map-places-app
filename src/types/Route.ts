export interface RouteInfoProps {
  distance: number | null;
  duration: number | null;
  loading: boolean;
  enabled?: boolean;
  selectedStep?: number | null;
  hoveredStep?: number | null;
}

export interface RouteMetricsProps {
  distance: number;
  duration: number;
}

export interface RouteStepsProps {
  selectedStep?: number | null;
  hoveredStep?: number | null;
}
