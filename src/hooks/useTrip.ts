import { useContext } from "react";
import { TripContext } from "@/contexts/TripContext";

export const useTrip = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error("useTrip must be used within a TripProvider");
  }
  return context;
};
