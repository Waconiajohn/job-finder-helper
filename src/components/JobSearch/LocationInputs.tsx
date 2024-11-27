import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Location } from "@/types";

interface LocationInputsProps {
  locations: Location[];
  onLocationChange: (index: number, field: keyof Location, value: string) => void;
  onAddLocation: () => void;
  onRemoveLocation: (index: number) => void;
}

export const LocationInputs = ({
  locations,
  onLocationChange,
  onAddLocation,
  onRemoveLocation,
}: LocationInputsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Locations</label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddLocation}
        >
          Add Location
        </Button>
      </div>
      {locations.map((location, index) => (
        <div key={index} className="flex gap-2">
          <Input
            placeholder="City name"
            value={location.city}
            onChange={(e) => onLocationChange(index, "city", e.target.value)}
            className="flex-1"
            aria-label={`City ${index + 1}`}
          />
          <Select
            value={location.radius}
            onValueChange={(value) => onLocationChange(index, "radius", value)}
            aria-label={`Radius for city ${index + 1}`}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Radius" />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50, 100].map((radius) => (
                <SelectItem key={radius} value={radius.toString()}>
                  Within {radius} miles
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {index > 0 && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => onRemoveLocation(index)}
              aria-label={`Remove location ${index + 1}`}
            >
              ×
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};