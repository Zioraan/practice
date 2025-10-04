import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const { error } = await signIn({ email, password });
      if (error) throw error;
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-sm p-8 space-y-6 bg-[var(--color-surface)] rounded-lg shadow-2xl border-2 border-[var(--color-border)] transition-colors duration-300">
        <h1 className="text-3xl font-medieval text-center text-[var(--color-text-primary)] transition-colors duration-300">
          Welcome Back
        </h1>
        {error && (
          <p className="text-[var(--color-danger)] text-center transition-colors duration-300">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold text-[var(--color-text-primary)] transition-colors duration-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-[var(--color-text-primary)] bg-[var(--color-surface-accent)] rounded-md border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-text-primary)] transition-colors duration-300"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-bold text-[var(--color-text-primary)] transition-colors duration-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-[var(--color-text-primary)] bg-[var(--color-surface-accent)] rounded-md border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-text-primary)] transition-colors duration-300"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 font-semibold text-[var(--color-background)] bg-[var(--color-text-primary)] rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-text-primary)] transition-colors duration-300"
          >
            Log In
          </button>
        </form>
        <p className="text-sm text-center text-[var(--color-text-secondary)] transition-colors duration-300">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-bold text-[var(--color-text-primary)] hover:underline transition-colors duration-300"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
