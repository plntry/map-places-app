import React from "react";
import { MapPin } from "lucide-react";
import { ActivityCard } from "./components";
import { ActivitiesSectionProps } from "@/types/Sidebar";

const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({
  activeDay,
  hoveredActivity,
  selectedActivity,
  onActivityHover,
  onActivitySelect,
}) => {
  return (
    <section className="animate-fade-in" aria-labelledby="activities-heading">
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
        className="space-y-4 mb-[2rem]"
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
  );
};

export default ActivitiesSection;
