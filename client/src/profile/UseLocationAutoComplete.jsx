import { useState, useEffect } from "react";

const useLocationAutocomplete = (query) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (query.length > 2) {
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1&limit=5`
      )
        .then((response) => response.json())
        .then((data) => {
          setSuggestions(
            data.map((item) => ({
              display_name: item.display_name,
              address: item.address,
            }))
          );
        })
        .catch((error) =>
          console.error("Error fetching location data:", error)
        );
    } else {
      setSuggestions([]);
    }
  }, [query]);

  return suggestions;
};

export default useLocationAutocomplete;
