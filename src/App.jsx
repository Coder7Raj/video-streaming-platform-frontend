import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import EditVideo from "./pages/EditVideo";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyVideos from "./pages/MyVideos";
import Signup from "./pages/Signup";
import UploadPage from "./pages/UploadPage";
import VideoPage from "./pages/VideoPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/video/:id" element={<VideoPage />} />
        <Route path="/my-videos" element={<MyVideos />} />
        <Route path="/edit/:id" element={<EditVideo />} />
      </Routes>
    </Router>
  );
};

export default App;
