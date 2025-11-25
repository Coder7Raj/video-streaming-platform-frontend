import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getVideos, searchVideos } from "../api/api";
import Navbar from "../components/Navbar";
import VideoCard from "../components/VideoCard";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        let res;
        if (searchQuery) {
          res = await searchVideos(searchQuery);
        } else {
          res = await getVideos();
        }
        // Sort oldest first (optional)
        const sortedVideos = res.data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setVideos(sortedVideos);
      } catch (err) {
        console.error(err);
      }
    };
    fetchVideos();
  }, [searchQuery]);

  return (
    <div className="max-w-5xl mx-auto">
      <Navbar />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default Home;
