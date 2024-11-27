import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DATE_RANGES } from "@/lib/constants";

interface DateRangeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const DateRangeSelector = ({ value, onChange }: DateRangeSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Date Posted</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select date range" />
        </SelectTrigger>
        <SelectContent>
          {DATE_RANGES.map((range) => (
            <SelectItem key={range.value} value={range.value}>
              {range.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};