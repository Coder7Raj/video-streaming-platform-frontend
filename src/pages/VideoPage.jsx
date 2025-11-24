import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVideos } from "../api/api";
import Navbar from "../components/Navbar";

const VideoPage = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      const res = await getVideos();
      const vid = res.data.find((v) => v._id === id);
      setVideo(vid);
    };
    fetchVideo();
  }, [id]);

  if (!video) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="p-4 flex flex-col items-center">
        <div className="bg-gray-300 h-80 w-full md:w-3/4 flex items-center justify-center text-2xl font-bold">
          Video Player Placeholder
        </div>
        <h1 className="text-2xl font-bold mt-4">{video.title}</h1>
        <p className="mt-2">{video.description}</p>
        <p className="mt-2 text-gray-500">Tags: {video.tags.join(", ")}</p>
        <p className="mt-2 text-gray-500">Transcript: {video.transcript}</p>
      </div>
    </div>
  );
};

export default VideoPage;
