import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getVideos } from "../api/api";
import Navbar from "../components/Navbar";
import Loader from "../custom/Loader";

const BACKEND_URL = "http://localhost:5000";

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

const getYouTubeThumbnail = (url) => {
  if (!url) return "";
  let videoId = "";
  if (url.includes("youtu.be")) {
    videoId = url.split("/").pop().split("?")[0];
  } else if (url.includes("youtube.com/watch")) {
    videoId = new URL(url).searchParams.get("v");
  }
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";
};

const VideoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await getVideos();
      setVideos(res.data);

      const vid = res.data.find((v) => v._id === id);
      setVideo(vid);
    };
    fetchVideos();
  }, [id]);

  if (!video) return <Loader />;

  const isYouTube =
    video.url &&
    (video.url.includes("youtube.com") || video.url.includes("youtu.be"));

  const videoSrc = isYouTube
    ? getYouTubeEmbedUrl(video.url)
    : BACKEND_URL + video.filePath;

  const relatedVideos = videos.filter((v) => v._id !== id);

  return (
    <div>
      <Navbar />
      <div className="flex flex-col lg:flex-row gap-3 p-1">
        {/* Main video */}
        <div className="w-full lg:w-[70%]">
          {isYouTube ? (
            <iframe
              width="100%"
              height="480"
              src={videoSrc}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video src={videoSrc} controls width="100%" height="480" />
          )}

          <div className="flex flex-col items-start justify-start space-y-2 mt-4">
            <h1 className="text-2xl font-bold">{video.title}</h1>
            <p>{video.description}</p>
            <p className="text-gray-500">Tags: {video.tags.join(", ")}</p>
            <p className="text-gray-500">Transcript: {video.transcript}</p>
          </div>
        </div>

        {/* Related videos */}
        <div className="w-full lg:w-[30%] flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-2">
          <h2 className="text-lg font-semibold mb-2">Related Videos</h2>
          {relatedVideos.map((rel) => {
            const isYT =
              rel.url &&
              (rel.url.includes("youtube.com") || rel.url.includes("youtu.be"));
            const thumbnail = isYT
              ? getYouTubeThumbnail(rel.url)
              : BACKEND_URL + rel.filePath;

            return (
              <div
                key={rel._id}
                className="cursor-pointer flex gap-2 items-start hover:bg-gray-100 p-2 rounded transition"
                onClick={() => navigate(`/video/${rel._id}`)}
              >
                {isYT ? (
                  <img
                    src={thumbnail}
                    alt={rel.title}
                    className="w-32 h-20 object-cover rounded"
                  />
                ) : (
                  <video
                    src={thumbnail}
                    muted
                    className="w-32 h-20 object-cover rounded"
                  />
                )}
                <div className="flex flex-col justify-start">
                  <p className="text-sm font-medium">{rel.title}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {rel.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
