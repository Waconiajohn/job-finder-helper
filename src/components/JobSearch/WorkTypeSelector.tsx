import React from "react";
import { Badge } from "@/components/ui/badge";
import { WORK_LOCATIONS } from "@/lib/constants";

interface WorkTypeSelectorProps {
  selectedTypes: string[];
  onToggle: (value: string) => void;
}

export const WorkTypeSelector = ({ selectedTypes, onToggle }: WorkTypeSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Work Location Types</label>
      <div className="flex flex-wrap gap-2">
        {WORK_LOCATIONS.map((type) => (
          <Badge
            key={type.value}
            variant={selectedTypes.includes(type.value) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onToggle(type.value)}
            role="checkbox"
            aria-checked={selectedTypes.includes(type.value)}
          >
            {type.label}
          </Badge>
        ))}
      </div>
    </div>
  );
};