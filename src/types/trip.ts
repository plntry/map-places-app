export interface Activity {
  id: number;
  name: string;
  description: string;
  photo_url: string;
  coords: {
    lat: number;
    lng: number;
  };
}

export interface Day {
  id: number;
  title: string;
  activities: Activity[];
}

export interface Trip {
  trip_title: string;
  days: Day[];
}