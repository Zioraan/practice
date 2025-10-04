import { useAuth } from "./context/AuthContext";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import CharacterList from "./components/CharacterList";
import CharacterDetails from "./pages/CharacterDetails";
import { useTheme } from "./context/ThemeContext";
import ThemeBackground from "./components/ThemeBackground";

function App() {
  const { user } = useAuth();

  return (
    <>
      <ThemeBackground />
      <div className="relative min-h-screen text-[var(--color-text-primary)]">
        {user ? <AuthenticatedApp /> : <PublicApp />}
      </div>
    </>
  );
}

function AuthenticatedApp() {
  const { signOut } = useAuth();
  const { theme, toggleTheme, isTransitioning } = useTheme();
  const animationDelay = isTransitioning ? "500ms" : "0ms";

  return (
    <div className="container mx-auto p-4">
      <header
        className="flex justify-between items-center mb-8 transition-colors duration-800"
        style={{ transitionDelay: animationDelay }}
      >
        <h1
          className="text-2xl md:text-3xl font-medieval transition-colors duration-800"
          style={{ transitionDelay: animationDelay }}
        >
          <Link to="/">The Red Book of Westmarch</Link>
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="px-4 py-2 font-semibold text-[var(--color-text-primary)] bg-[var(--color-surface-accent)] rounded-md hover:bg-opacity-90 text-sm transition-colors duration-800"
            style={{ transitionDelay: animationDelay }}
          >
            {theme === "fellowship"
              ? "Take the Path of Shadow"
              : "Return to the Light"}
          </button>
          <button
            onClick={signOut}
            className="px-4 py-2 font-semibold text-[var(--color-background)] bg-[var(--color-danger)] rounded-md hover:bg-opacity-90 transition-colors duration-800"
            style={{ transitionDelay: animationDelay }}
          >
            Sign Out
          </button>
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<CharacterList />} />
          <Route path="/character/:id" element={<CharacterDetails />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

function PublicApp() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
