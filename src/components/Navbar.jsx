import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex flex-col md:flex-row justify-between items-center">
      <div
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        VideoStream
      </div>

      <SearchBar />

      <div className="flex gap-4 mt-2 md:mt-0">
        {token ? (
          <>
            <Link to="/upload" className="bg-blue-600 px-3 py-1 rounded">
              Upload
            </Link>

            {/* ➤ Added My Videos */}
            <Link to="/my-videos" className="bg-purple-600 px-3 py-1 rounded">
              My Videos
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="bg-green-600 px-3 py-1 rounded">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
