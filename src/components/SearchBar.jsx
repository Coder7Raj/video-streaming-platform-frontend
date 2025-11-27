import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchVideos } from "../api/api";

const useDebounce = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [highlight, setHighlight] = useState(-1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    let active = true;

    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await searchVideos(debouncedQuery);
        if (active) setResults(res.data.slice(0, 7));
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchResults();
    return () => (active = false);
  }, [debouncedQuery]);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (id) => {
    setQuery("");
    setResults([]);
    navigate(`/video/${id}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/?search=${query}`);
    setResults([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setHighlight((h) => (h + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      setHighlight((h) => (h === 0 ? results.length - 1 : h - 1));
    } else if (e.key === "Enter" && highlight >= 0) {
      handleSelect(results[highlight]._id);
    }
  };

  return (
    <div className="relative w-full md:w-1/3" ref={wrapperRef}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="w-full p-2 rounded text-black"
          placeholder="Search videos..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlight(-1);
          }}
          onKeyDown={handleKeyDown}
        />
      </form>

      {query.trim() && (
        <ul className="absolute bg-white w-full mt-1 rounded shadow-lg z-50 max-h-72 overflow-auto">
          {loading && <li className="p-2 italic">Searching...</li>}
          {!loading &&
            results.map((video, i) => (
              <li
                key={video._id}
                className={`p-2 cursor-pointer ${
                  highlight === i ? "bg-gray-300" : "hover:bg-gray-200"
                }`}
                onClick={() => handleSelect(video._id)}
                onMouseEnter={() => setHighlight(i)}
              >
                <div className="font-medium truncate">{video.title}</div>
                <div className="text-sm text-gray-600 truncate">
                  {(video.tags || []).slice(0, 4).join(", ")}
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
