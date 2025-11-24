import { useNavigate } from "react-router-dom";

const VideoCard = ({ video }) => {
  const navigate = useNavigate();
  return (
    <div
      className="border rounded p-2 cursor-pointer hover:shadow-lg transition"
      onClick={() => navigate(`/video/${video._id}`)}
    >
      <div className="bg-gray-300 h-40 flex items-center justify-center text-xl font-bold">
        Video Preview
      </div>
      <h3 className="font-semibold mt-2">{video.title}</h3>
      <p className="text-sm text-gray-500">{video.description}</p>
    </div>
  );
};

export default VideoCard;
