"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SearchFilters({ onChange }) {
  const [specialization, setSpecialization] = useState("");
  const [mode, setMode] = useState("");

  const handleChange = (newValues) => {
    onChange({
      specialization,
      mode,
      ...newValues,
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-end w-full">
      {/* Specialization Filter */}
      <Select
        value={specialization}
        onValueChange={(val) => {
          setSpecialization(val);
          handleChange({ specialization: val });
        }}
      >
        <SelectTrigger className="w-full md:w-[220px]">
          <SelectValue placeholder="All Specializations" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Specialization</SelectLabel>
            <SelectItem value="all">All Specializations</SelectItem>
            <SelectItem value="Cardiologist">Cardiologist</SelectItem>
            <SelectItem value="Dermatologist">Dermatologist</SelectItem>
            <SelectItem value="Pediatrician">Pediatrician</SelectItem>
            <SelectItem value="General Physician">General Physician</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Mode Filter */}
      <Select
        value={mode}
        onValueChange={(val) => {
          setMode(val);
          handleChange({ mode: val });
        }}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="All Modes" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Mode</SelectLabel>
            <SelectItem value="all">All Modes</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="in-person">Offline</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
