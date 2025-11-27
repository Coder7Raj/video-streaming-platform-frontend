import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import {
  addComment,
  deleteComment,
  getComments,
  getVideos,
  updateComment,
} from "../api/api";
import Navbar from "../components/Navbar";
import Loader from "../custom/Loader";

const BACKEND_URL = "http://localhost:5000";
const socket = io(BACKEND_URL);

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

  const [comments, setComments] = useState([]);
  const [username, setUsername] = useState("");
  const [newComment, setNewComment] = useState("");

  const commentsEndRef = useRef(null);

  // Fetch video and related videos
  useEffect(() => {
    const fetchVideos = async () => {
      const res = await getVideos();
      setVideos(res.data);
      const vid = res.data.find((v) => v._id === id);
      setVideo(vid);
    };
    fetchVideos();
  }, [id]);

  // Fetch comments
  useEffect(() => {
    if (!video) return;

    const fetchComments = async () => {
      const res = await getComments(video._id);
      setComments(res.data);
    };
    fetchComments();
  }, [video]);

  // Socket.IO for real-time comments
  useEffect(() => {
    socket.on("receiveComment", (comment) => {
      if (comment.videoId === video?._id)
        setComments((prev) => [comment, ...prev]);
    });
    socket.on("receiveEdit", (comment) => {
      setComments((prev) =>
        prev.map((c) => (c._id === comment._id ? comment : c))
      );
    });
    socket.on("receiveDelete", (commentId) => {
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    });

    return () => {
      socket.off("receiveComment");
      socket.off("receiveEdit");
      socket.off("receiveDelete");
    };
  }, [video]);

  const scrollToNewest = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToNewest();
  }, [comments]);

  if (!video) return <Loader />;

  const isYouTube =
    video.url &&
    (video.url.includes("youtube.com") || video.url.includes("youtu.be"));
  const videoSrc = isYouTube
    ? getYouTubeEmbedUrl(video.url)
    : BACKEND_URL + video.filePath;
  const relatedVideos = videos.filter((v) => v._id !== id);

  // Comment actions
  const handleAddComment = async () => {
    if (!username || !newComment) return alert("Enter your name and comment");
    try {
      const res = await addComment({
        videoId: video._id,
        user: username,
        text: newComment,
      });
      socket.emit("newComment", res.data);
      setNewComment("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditComment = async (id, text) => {
    const newText = prompt("Edit your comment:", text);
    if (!newText) return;
    try {
      const res = await updateComment(id, { user: username, text: newText });
      socket.emit("editComment", res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (id) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      await deleteComment(id, username);
      socket.emit("deleteComment", id);
    } catch (err) {
      console.error(err);
    }
  };

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

          {/* Comment Section */}
          <div className="mt-6 w-full">
            <h2 className="text-lg font-semibold mb-3">Comments</h2>

            {/* Add comment */}
            <div className="flex flex-col gap-2 mb-4">
              <input
                type="text"
                placeholder="Your Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border rounded p-2 w-full"
              />
              <textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="border rounded p-2 w-full resize-none"
                rows={3}
              />
              <button
                onClick={handleAddComment}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-32"
              >
                Comment
              </button>
            </div>

            {/* List of comments */}
            <div className="flex flex-col gap-3 max-h-80 overflow-y-auto">
              {comments.length === 0 && <p>No comments yet.</p>}
              {comments.map((c) => (
                <div key={c._id} className="border rounded p-2 relative">
                  <p className="font-semibold">{c.user}</p>
                  <p className="text-gray-700">{c.text}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(c.createdAt).toLocaleString()}
                  </p>

                  {c.user === username && (
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={() => handleEditComment(c._id, c.text)}
                        className="text-blue-500 text-xs hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(c._id)}
                        className="text-red-500 text-xs hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <div ref={commentsEndRef} />
            </div>
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
