import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UploadBook from "./pages/UploadBook";
import MyBooks from "./pages/MyBooks";
import BookDetails from "./pages/BookDetails";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/my-books" element={<ProtectedRoute><MyBooks /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><UploadBook /></ProtectedRoute>} />
        <Route path="/books/:id" element={<ProtectedRoute><BookDetails /></ProtectedRoute>} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}
