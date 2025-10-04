const API_URL = "https://the-one-api.dev/v2";
const API_KEY = import.meta.env.VITE_THE_ONE_API_KEY;

export const getCharacters = async () => {
  try {
    // Fetch all characters by setting a large limit. The API has ~933 characters.
    const response = await fetch(`${API_URL}/character?limit=1000`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch characters");
    }

    const data = await response.json();
    return data.docs; // Return the full array of characters
  } catch (error) {
    console.error("Error fetching characters:", error);
    return [];
  }
};

export const getCharacterById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/character/${id}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch character details");
    }

    const data = await response.json();
    return data.docs[0]; // The API returns an array with one item
  } catch (error) {
    console.error("Error fetching character details:", error);
    return null;
  }
};
