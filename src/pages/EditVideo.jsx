import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getVideos, updateVideo } from "../api/api";
import Navbar from "../components/Navbar";

const EditVideo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
  });

  useEffect(() => {
    const fetchVideo = async () => {
      const res = await getVideos();
      const vid = res.data.find((v) => v._id === id);
      setVideo(vid);
      setForm({
        title: vid.title,
        description: vid.description,
        tags: vid.tags.join(", "),
      });
    };
    fetchVideo();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updateVideo(id, {
      title: form.title,
      description: form.description,
      tags: form.tags.split(",").map((t) => t.trim()),
    });

    navigate("/my-videos");
  };

  if (!video) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />

      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Edit Video</h1>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            className="p-2 border rounded"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <textarea
            className="p-2 border rounded"
            rows="4"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <input
            className="p-2 border rounded"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />

          <button className="bg-green-600 text-white py-2 rounded">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditVideo;
