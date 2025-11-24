import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadVideo } from "../api/api";
import Navbar from "../components/Navbar";

const Upload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [transcript, setTranscript] = useState("");
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"))._id;
    try {
      await uploadVideo({
        user,
        title,
        description,
        tags: tags.split(","),
        transcript,
        url,
      });
      navigate("/");
    } catch (err) {
      alert(err.response.data.error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center mt-10">
        <form
          className="bg-gray-100 p-6 rounded shadow-md w-96"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl mb-4">Upload Video</h2>
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 mb-3 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            className="w-full p-2 mb-3 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tags (comma separated)"
            className="w-full p-2 mb-3 rounded"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <textarea
            placeholder="Transcript"
            className="w-full p-2 mb-3 rounded"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />
          <input
            type="text"
            placeholder="Video URL"
            className="w-full p-2 mb-3 rounded"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button className="w-full bg-blue-600 text-white p-2 rounded">
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
