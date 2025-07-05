import { useContext } from "react";
import { MapInstanceContext } from "@/contexts/MapInstanceContext";

export const useMapInstanceContext = () => useContext(MapInstanceContext);
