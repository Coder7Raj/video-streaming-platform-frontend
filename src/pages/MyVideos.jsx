import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteVideo, getVideos, updateVideo } from "../api/api";
import Navbar from "../components/Navbar";

const BACKEND_URL = "http://localhost:5000";

// Function to get YouTube thumbnail
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

const MyVideos = () => {
  const [videos, setVideos] = useState([]);
  const [editingVideo, setEditingVideo] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    tags: "",
  });

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  // Fetch user videos
  useEffect(() => {
    const fetchMyVideos = async () => {
      try {
        const res = await getVideos();

        const filtered = res.data.filter((v) => {
          const videoUserId = v.user?._id || v.user;
          return videoUserId?.toString() === userId;
        });

        setVideos(filtered);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
        setVideos([]); // fallback
      }
    };

    fetchMyVideos();
  }, [userId]);

  // Delete video
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this video?")) {
      await deleteVideo(id);
      setVideos(videos.filter((v) => v._id !== id));
    }
  };

  // Open edit modal
  const startEdit = (video) => {
    setEditingVideo(video);
    setEditForm({
      title: video.title,
      description: video.description,
      tags: video.tags.join(", "),
    });
  };

  // Save updated video
  const handleUpdate = async () => {
    const title = editForm.title.trim();
    const description = editForm.description.trim();
    const tags = editForm.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t); // array of strings

    if (!title || !description) {
      alert("Title and description cannot be empty.");
      return;
    }

    const updatedData = { title, description, tags };

    try {
      await updateVideo(editingVideo._id, updatedData);

      setVideos(
        videos.map((v) =>
          v._id === editingVideo._id ? { ...v, ...updatedData } : v
        )
      );

      setEditingVideo(null);
      alert("Video updated successfully!");
    } catch (error) {
      console.error("Failed to update video:", error.response?.data || error);
      alert(error.response?.data?.error || "Update failed");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">My Videos</h1>

        {videos.length === 0 ? (
          <p className="text-gray-500">You have not uploaded any videos.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map((video) => {
              const isYouTube =
                video.url &&
                (video.url.includes("youtube.com") ||
                  video.url.includes("youtu.be"));
              const thumbnail = isYouTube
                ? getYouTubeThumbnail(video.url)
                : BACKEND_URL + video.filePath;

              return (
                <div
                  key={video._id}
                  className="border rounded shadow-sm p-3 cursor-pointer hover:shadow-lg transition"
                  onClick={() => navigate(`/video/${video._id}`)}
                >
                  {isYouTube ? (
                    <img
                      src={thumbnail}
                      alt={video.title}
                      className="w-full h-40 object-cover rounded"
                    />
                  ) : (
                    <video
                      src={thumbnail}
                      className="w-full h-40 object-cover rounded"
                      muted
                      controls={false}
                    />
                  )}

                  <h2 className="text-lg font-semibold mt-2">{video.title}</h2>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(video);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(video._id);
                      }}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setEditingVideo(null)}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Edit Video</h2>

            <input
              className="w-full p-2 border rounded mb-2"
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
              placeholder="Title"
            />

            <textarea
              className="w-full p-2 border rounded mb-2"
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
              placeholder="Description"
            />

            <input
              className="w-full p-2 border rounded mb-4"
              value={editForm.tags}
              onChange={(e) =>
                setEditForm({ ...editForm, tags: e.target.value })
              }
              placeholder="Tags (comma separated)"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditingVideo(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyVideos;
