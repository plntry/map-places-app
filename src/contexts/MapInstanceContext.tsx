import { createContext, MutableRefObject } from "react";

export const MapInstanceContext =
  createContext<MutableRefObject<google.maps.Map | null> | null>(null);
