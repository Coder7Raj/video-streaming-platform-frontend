import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getVideos, searchVideos } from "../api/api";
import Navbar from "../components/Navbar";
import VideoCard from "../components/VideoCard";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 16;

  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("search");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        let res;
        if (searchQuery) {
          res = await searchVideos(searchQuery);
        } else {
          res = await getVideos();
        }

        const sortedVideos = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setVideos(sortedVideos);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [searchQuery]);

  // PAGINATION LOGIC
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = videos.slice(indexOfFirstVideo, indexOfLastVideo);

  const totalPages = Math.ceil(videos.length / videosPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Skeleton Loader
  const SkeletonCard = () => (
    <div className="border rounded p-2 animate-pulse">
      <div className="h-40 bg-gray-300 rounded"></div>
      <div className="mt-3 h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="mt-2 h-3 bg-gray-300 rounded w-1/2"></div>
    </div>
  );

  return (
    <div>
      <div className="max-w-[1520px] mx-auto">
        <Navbar />

        {/* VIDEO GRID */}
        <div
          key={currentPage}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4"
        >
          {loading
            ? [...Array(videosPerPage)].map((_, i) => <SkeletonCard key={i} />)
            : currentVideos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
        </div>

        {/* PAGINATION */}
        {!loading && videos.length > 0 && (
          <div className="flex justify-center gap-2 my-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg border shadow-sm hover:bg-gray-100 transition ${
                currentPage === 1 ? "opacity-40 cursor-not-allowed" : ""
              }`}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              return (
                <button
                  key={index}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-4 py-2 rounded-lg border shadow-sm transition ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg border shadow-sm hover:bg-gray-100 transition ${
                currentPage === totalPages
                  ? "opacity-40 cursor-not-allowed"
                  : ""
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
