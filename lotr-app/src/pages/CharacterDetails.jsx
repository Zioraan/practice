import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getCharacterById } from "../services/theOneApi";
import { useTheme } from "../context/ThemeContext";

export default function CharacterDetails() {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isTransitioning } = useTheme();

  const animationDelay = isTransitioning ? "750ms" : "0ms";

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        setLoading(true);
        const data = await getCharacterById(id);
        setCharacter(data);
      } catch (error) {
        console.error("Failed to fetch character details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacter();
  }, [id]);

  if (loading) {
    return (
      <p className="text-center text-2xl font-medieval text-yellow-300 mt-12">
        Chronicling the deeds of ages past...
      </p>
    );
  }

  if (!character) {
    return (
      <p className="text-center text-red-500 mt-12">
        This record has been lost to time.
      </p>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Link
        to="/"
        className="text-[var(--color-text-secondary)] hover:underline mb-8 block transition-colors duration-800"
        style={{ transitionDelay: animationDelay }}
      >
        &larr; Back to the Fellowship
      </Link>

      <div
        className="bg-[var(--color-surface)] rounded-lg shadow-lg p-6 md:p-8 border-2 border-[var(--color-border)] transition-colors duration-800"
        style={{ transitionDelay: animationDelay }}
      >
        <h1
          className="text-4xl md:text-5xl font-medieval text-[var(--color-text-primary)] text-center mb-6 transition-colors duration-800"
          style={{ transitionDelay: animationDelay }}
        >
          {character.name}
        </h1>

        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-lg text-[var(--color-text-secondary)] transition-colors duration-800"
          style={{ transitionDelay: animationDelay }}
        >
          <DetailItem
            label="Race"
            value={character.race}
            animationDelay={animationDelay}
          />
          <DetailItem
            label="Gender"
            value={character.gender}
            animationDelay={animationDelay}
          />
          <DetailItem
            label="Birth"
            value={character.birth}
            animationDelay={animationDelay}
          />
          <DetailItem
            label="Death"
            value={character.death}
            animationDelay={animationDelay}
          />
          <DetailItem
            label="Realm"
            value={character.realm}
            animationDelay={animationDelay}
          />
          <DetailItem
            label="Spouse"
            value={character.spouse}
            animationDelay={animationDelay}
          />
        </div>

        {character.wikiUrl && (
          <div className="text-center mt-8">
            <a
              href={character.wikiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 font-medieval text-xl text-[var(--color-background)] bg-[var(--color-text-primary)] rounded-sm shadow-lg transform hover:scale-105 transition-all duration-800"
              style={{ transitionDelay: animationDelay }}
            >
              Consult the Archives
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

const DetailItem = ({ label, value, animationDelay }) => (
  <div
    className="flex justify-between border-b border-[var(--color-border)] py-2 transition-colors duration-800"
    style={{ transitionDelay: animationDelay }}
  >
    <span
      className="font-bold text-[var(--color-text-primary)] transition-colors duration-800"
      style={{ transitionDelay: animationDelay }}
    >
      {label}:
    </span>
    <span
      className="transition-colors duration-800"
      style={{ transitionDelay: animationDelay }}
    >
      {value || "Unknown"}
    </span>
  </div>
);
