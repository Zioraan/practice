import { useFavorites } from "../context/FavoritesContext";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const THEME_SURFACE_COLORS = {
  fellowship: {
    from: "#efebe2",
    via: "#e8e2d5",
    to: "#efebe2",
  },
  sauron: {
    from: "#2a2a2a",
    via: "#3a3a3a",
    to: "#2a2a2a",
  },
};

export default function CharacterCard({
  character,
  index,
  isTransitioning,
  previousTheme,
}) {
  const { theme } = useTheme();
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const isFavorite = favorites.includes(character._id);

  const handleFavorite = () => {
    if (isFavorite) {
      removeFavorite(character._id);
    } else {
      addFavorite(character._id);
    }
  };

  const rippleDelay = index * 50;
  const baseDelay = 500; // Faster start for cards
  const animationDelay = isTransitioning
    ? `${baseDelay + rippleDelay}ms`
    : "0ms";

  const baseColors =
    isTransitioning && previousTheme
      ? THEME_SURFACE_COLORS[previousTheme]
      : THEME_SURFACE_COLORS[theme];
  const newColors = THEME_SURFACE_COLORS[theme];

  return (
    <div
      className="relative rounded-lg shadow-lg p-4 flex flex-col justify-between border-2 border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      style={{ transitionDelay: animationDelay }}
    >
      {/* Background Wipe Layer */}
      <div className="absolute inset-0 -z-10 rounded-lg overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br"
          style={{
            "--tw-gradient-from": baseColors.from,
            "--tw-gradient-stops": `var(--tw-gradient-from), ${baseColors.via}, var(--tw-gradient-to)`,
            "--tw-gradient-to": baseColors.to,
          }}
        />
        {isTransitioning && (
          <div
            className="absolute inset-0 bg-gradient-to-br animate-card-wipe"
            style={{
              "--tw-gradient-from": newColors.from,
              "--tw-gradient-stops": `var(--tw-gradient-from), ${newColors.via}, var(--tw-gradient-to)`,
              "--tw-gradient-to": newColors.to,
              animationDelay,
            }}
          />
        )}
      </div>

      {/* Content Layer */}
      <div className="text-center mb-4">
        <h2
          className="text-2xl font-medieval text-[var(--color-text-primary)] truncate transition-colors duration-800"
          style={{ transitionDelay: animationDelay }}
        >
          {character.name}
        </h2>
        <div
          className="text-sm text-[var(--color-text-secondary)] mt-2 transition-colors duration-800"
          style={{ transitionDelay: animationDelay }}
        >
          <p>{character.birth || "Unknown"}</p>
          <p
            className="text-[var(--color-text-primary)] transition-colors duration-800"
            style={{ transitionDelay: animationDelay }}
          >
            -
          </p>
          <p>{character.death || "Unknown"}</p>
        </div>
      </div>
      <div
        className="text-[var(--color-text-secondary)] text-sm space-y-2 transition-colors duration-800"
        style={{ transitionDelay: animationDelay }}
      >
        <div className="flex justify-between">
          <span
            className="font-semibold text-[var(--color-text-primary)] transition-colors duration-800"
            style={{ transitionDelay: animationDelay }}
          >
            Race:
          </span>
          <span>{character.race || "Unknown"}</span>
        </div>
        <div className="flex justify-between">
          <span
            className="font-semibold text-[var(--color-text-primary)] transition-colors duration-800"
            style={{ transitionDelay: animationDelay }}
          >
            Gender:
          </span>
          <span> {character.gender || "Unknown"}</span>
        </div>
      </div>
      <div className="mt-4 flex space-x-2">
        <button
          onClick={handleFavorite}
          className={`w-1/2 py-2 font-semibold text-[var(--color-background)] rounded-md text-sm transition-colors duration-800 ${
            isFavorite
              ? "bg-[var(--color-danger)] hover:bg-opacity-90"
              : "bg-[var(--color-primary)] hover:bg-opacity-90"
          }`}
          style={{ transitionDelay: animationDelay }}
        >
          {isFavorite ? "Unfavorite" : "Favorite"}
        </button>
        <Link
          to={`/character/${character._id}`}
          className="w-1/2 py-2 text-center font-semibold text-[var(--color-background)] bg-[var(--color-secondary)] hover:bg-opacity-90 rounded-md text-sm transition-colors duration-800"
          style={{ transitionDelay: animationDelay }}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
