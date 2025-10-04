import { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("favorites")
        .select("item_id")
        .eq("user_id", user.id);

      if (error) throw error;
      setFavorites(data.map((fav) => fav.item_id));
    } catch (error) {
      console.error("Error fetching favorites:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (itemId) => {
    try {
      const { error } = await supabase
        .from("favorites")
        .insert({ user_id: user.id, item_id: itemId });

      if (error) throw error;
      setFavorites([...favorites, itemId]);
    } catch (error) {
      console.error("Error adding favorite:", error.message);
    }
  };

  const removeFavorite = async (itemId) => {
    try {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .match({ user_id: user.id, item_id: itemId });

      if (error) throw error;
      setFavorites(favorites.filter((id) => id !== itemId));
    } catch (error) {
      console.error("Error removing favorite:", error.message);
    }
  };

  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    loading,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  return useContext(FavoritesContext);
};
