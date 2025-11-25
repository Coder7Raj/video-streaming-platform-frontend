import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadVideo } from "../api/api";
import Navbar from "../components/Navbar";

const UploadPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [transcript, setTranscript] = useState("");
  const [uploadOption, setUploadOption] = useState("url"); // "url" or "file"
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"))._id;

    if (uploadOption === "url" && !url) {
      alert("Please enter a video URL");
      return;
    }

    if (uploadOption === "file" && !file) {
      alert("Please select a video file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("user", user);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("tags", tags.split(","));
      formData.append("transcript", transcript);

      if (uploadOption === "url") {
        formData.append("url", url);
      } else if (uploadOption === "file") {
        formData.append("video", file);
      }

      await uploadVideo(formData);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong!");
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

          {/* Toggle between URL and File */}
          <div className="mb-3 flex gap-4">
            <label>
              <input
                type="radio"
                name="uploadOption"
                value="url"
                checked={uploadOption === "url"}
                onChange={() => setUploadOption("url")}
              />{" "}
              Video URL
            </label>
            <label>
              <input
                type="radio"
                name="uploadOption"
                value="file"
                checked={uploadOption === "file"}
                onChange={() => setUploadOption("file")}
              />{" "}
              Upload File
            </label>
          </div>

          {/* Conditional input */}
          {uploadOption === "url" && (
            <input
              type="text"
              placeholder="Video URL"
              className="w-full p-2 mb-3 rounded"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          )}

          {uploadOption === "file" && (
            <input
              type="file"
              accept="video/*"
              className="w-full mb-3"
              onChange={(e) => setFile(e.target.files[0])}
            />
          )}

          <button className="w-full bg-blue-600 text-white p-2 rounded">
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
