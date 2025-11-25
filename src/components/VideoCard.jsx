import { useNavigate } from "react-router-dom";

const BACKEND_URL = "http://localhost:5000";

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

const VideoCard = ({ video }) => {
  const navigate = useNavigate();
  const isYouTube =
    video.url &&
    (video.url.includes("youtube.com") || video.url.includes("youtu.be"));

  const thumbnail = isYouTube
    ? getYouTubeThumbnail(video.url)
    : BACKEND_URL + video.filePath; // local uploaded video preview

  return (
    <div
      className="border rounded p-2 cursor-pointer hover:shadow-lg transition"
      onClick={() => navigate(`/video/${video._id}`)}
    >
      {isYouTube ? (
        <img
          src={thumbnail}
          alt={video.title}
          className="h-40 w-full object-cover rounded"
        />
      ) : (
        <video
          src={thumbnail}
          className="h-40 w-full object-cover rounded"
          muted
          controls={false} // small preview, no controls
        />
      )}
      <h3 className="font-semibold mt-2">{video.title}</h3>
      <p className="text-sm text-gray-500">{video.description}</p>
    </div>
  );
};

export default VideoCard;
