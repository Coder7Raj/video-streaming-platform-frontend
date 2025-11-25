import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVideos } from "../api/api";
import Navbar from "../components/Navbar";

const getYouTubeEmbedUrl = (url) => {
  if (!url) return "";
  let videoId = "";
  if (url.includes("youtu.be")) {
    videoId = url.split("/").pop().split("?")[0];
  } else if (url.includes("youtube.com/watch")) {
    videoId = new URL(url).searchParams.get("v");
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

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

  const isYouTube =
    video.url &&
    (video.url.includes("youtube.com") || video.url.includes("youtu.be"));

  return (
    <div>
      <Navbar />
      <div className="p-4 flex flex-col items-center">
        {isYouTube ? (
          <iframe
            width="100%"
            height="480"
            src={getYouTubeEmbedUrl(video.url)}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video src={video.filePath} controls width="100%" height="480" />
        )}

        <h1 className="text-2xl font-bold mt-4">{video.title}</h1>
        <p className="mt-2">{video.description}</p>
        <p className="mt-2 text-gray-500">Tags: {video.tags.join(", ")}</p>
        <p className="mt-2 text-gray-500">Transcript: {video.transcript}</p>
      </div>
    </div>
  );
};

export default VideoPage;
