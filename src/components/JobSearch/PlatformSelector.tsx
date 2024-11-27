import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ATS_PLATFORMS } from "@/lib/constants";

interface PlatformSelectorProps {
  selectedPlatforms: string[];
  onToggle: (platformId: string) => void;
}

export const PlatformSelector = ({ selectedPlatforms, onToggle }: PlatformSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">ATS Platforms</label>
      <div className="grid grid-cols-2 gap-2">
        {ATS_PLATFORMS.map((platform) => (
          <div key={platform.id} className="flex items-center space-x-2">
            <Checkbox
              id={platform.id}
              checked={selectedPlatforms.includes(platform.id)}
              onCheckedChange={() => onToggle(platform.id)}
            />
            <label
              htmlFor={platform.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {platform.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};