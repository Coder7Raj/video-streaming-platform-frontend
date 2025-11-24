import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchVideos } from "../api/api";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim() === "") return setSuggestions([]);
    const timeout = setTimeout(async () => {
      const res = await searchVideos(query);
      setSuggestions(res.data.slice(0, 5)); // top 5 suggestions
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (id) => {
    setQuery("");
    setSuggestions([]);
    navigate(`/video/${id}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/?search=${query}`);
    setSuggestions([]);
  };

  return (
    <div className="relative w-full md:w-1/3">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="w-full p-2 rounded text-black"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
      {suggestions.length > 0 && (
        <ul className="absolute bg-white text-black w-full mt-1 rounded shadow-lg z-50">
          {suggestions.map((video) => (
            <li
              key={video._id}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelect(video._id)}
            >
              {video.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
