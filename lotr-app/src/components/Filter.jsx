import React from "react";

export default function Filter({
  searchTerm,
  setSearchTerm,
  selectedRace,
  setSelectedRace,
  races,
  selectedGender,
  setSelectedGender,
  genders,
  animationDelay,
}) {
  const searchBarDelay = animationDelay
    ? `${parseInt(animationDelay) + 200}ms`
    : "200ms";

  return (
    <div
      className="mb-8 p-4 bg-[var(--color-surface)] rounded-lg shadow-md border border-[var(--color-border)] transition-colors duration-[1550ms]"
      style={{ transitionDelay: animationDelay }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 text-[var(--color-text-primary)] bg-[var(--color-surface-accent)] rounded-md border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-text-primary)] transition-colors duration-800"
          style={{ transitionDelay: searchBarDelay }}
        />
        <select
          value={selectedRace}
          onChange={(e) => setSelectedRace(e.target.value)}
          className="w-full px-3 py-2 text-[var(--color-text-primary)] bg-[var(--color-surface-accent)] rounded-md border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-text-primary)] transition-colors duration-800"
          style={{ transitionDelay: animationDelay }}
        >
          <option value="">All Races</option>
          {races.map((race) => (
            <option key={race} value={race}>
              {race}
            </option>
          ))}
        </select>
        <select
          value={selectedGender}
          onChange={(e) => setSelectedGender(e.target.value)}
          className="w-full px-3 py-2 text-[var(--color-text-primary)] bg-[var(--color-surface-accent)] rounded-md border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-text-primary)] transition-colors duration-800"
          style={{ transitionDelay: animationDelay }}
        >
          <option value="">All Genders</option>
          {genders.map((gender) => (
            <option key={gender} value={gender}>
              {gender}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
