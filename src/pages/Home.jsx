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
      if (searchQuery) {
        const res = await searchVideos(searchQuery);
        setVideos(res.data);
      } else {
        const res = await getVideos();
        setVideos(res.data);
      }
    };
    fetchVideos();
  }, [searchQuery]);

  return (
    <div>
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
