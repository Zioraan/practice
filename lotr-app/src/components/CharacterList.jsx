import { useState, useEffect, useMemo } from "react";
import { getCharacters } from "../services/theOneApi";
import CharacterCard from "./CharacterCard";
import { useTheme } from "../context/ThemeContext";
import Filter from "./Filter";

export default function CharacterList() {
  const [allCharacters, setAllCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRace, setSelectedRace] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const itemsPerPage = 20;
  const { isTransitioning, previousTheme } = useTheme();
  const animationDelay = isTransitioning ? "500ms" : "0ms";

  useEffect(() => {
    const fetchAllCharacters = async () => {
      try {
        setLoading(true);
        const data = await getCharacters();
        setAllCharacters(data);
      } catch (error) {
        console.error("Failed to fetch characters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCharacters();
  }, []);

  const { filteredCharacters, races, genders } = useMemo(() => {
    let characters = allCharacters;
    const raceSet = new Set();
    const genderSet = new Set();

    allCharacters.forEach((char) => {
      if (char.race) raceSet.add(char.race);
      if (char.gender) genderSet.add(char.gender);
    });

    if (searchTerm) {
      characters = characters.filter((char) =>
        char.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedRace) {
      characters = characters.filter((char) => char.race === selectedRace);
    }
    if (selectedGender) {
      characters = characters.filter((char) => char.gender === selectedGender);
    }

    return {
      filteredCharacters: characters,
      races: Array.from(raceSet).sort(),
      genders: Array.from(genderSet).sort(),
    };
  }, [allCharacters, searchTerm, selectedRace, selectedGender]);

  // Client-side pagination logic
  const totalPages = Math.ceil(filteredCharacters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedCharacters = filteredCharacters.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRace, selectedGender]);

  if (loading) {
    return (
      <p className="text-center text-xl mt-8">
        Fetching the full history of Middle-earth...
      </p>
    );
  }

  return (
    <div>
      <Filter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedRace={selectedRace}
        setSelectedRace={setSelectedRace}
        races={races}
        selectedGender={selectedGender}
        setSelectedGender={setSelectedGender}
        genders={genders}
        animationDelay={animationDelay}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedCharacters.length > 0 ? (
          displayedCharacters.map((char, index) => (
            <CharacterCard
              key={char._id}
              character={char}
              index={index}
              isTransitioning={isTransitioning}
              previousTheme={previousTheme}
            />
          ))
        ) : (
          <p className="text-center col-span-full text-xl font-medieval text-[var(--color-text-secondary)] mt-8">
            No characters match the current filters.
          </p>
        )}
      </div>
      {totalPages > 0 && (
        <div className="flex justify-center items-center mt-8 space-x-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 font-semibold text-[var(--color-background)] bg-[var(--color-text-secondary)] rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-lg font-bold transition-colors duration-1000">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 font-semibold text-[var(--color-background)] bg-[var(--color-text-secondary)] rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
