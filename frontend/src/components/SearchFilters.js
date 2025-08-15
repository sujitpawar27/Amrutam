"use client";
import { useState } from "react";

export default function SearchFilters({ onChange }) {
  const [specialization, setSpecialization] = useState("");
  const [mode, setMode] = useState("");

  const handleChange = () => {
    onChange({
      specialization,
      mode,
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Specialization filter */}
      <select
        value={specialization}
        onChange={(e) => {
          setSpecialization(e.target.value);
          handleChange();
        }}
        className="border border-gray-300 rounded-lg p-2"
      >
        <option value="">All Specializations</option>
        <option value="Cardiologist">Cardiologist</option>
        <option value="Dermatologist">Dermatologist</option>
        <option value="Pediatrician">Pediatrician</option>
        <option value="General Physician">General Physician</option>
        {/* Add more specializations as needed */}
      </select>

      {/* Mode filter */}
      <select
        value={mode}
        onChange={(e) => {
          setMode(e.target.value);
          handleChange();
        }}
        className="border border-gray-300 rounded-lg p-2"
      >
        <option value="">All Modes</option>
        <option value="online">Online</option>
        <option value="offline">Offline</option>
      </select>
    </div>
  );
}
