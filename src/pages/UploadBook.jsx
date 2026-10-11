import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ALLOWED_EXTENSIONS, MAX_FILE_SIZE, addBook } from "../services/bookService";
import { deleteBookFile, uploadBookFile } from "../services/storageService";
import { friendlyError } from "../services/errorMessages";

export default function UploadBook() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", author: "", category: "", description: "" });
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    if (!user) return "You must be logged in to upload.";
    if (!form.title.trim() || !form.author.trim() || !form.category.trim() || !form.description.trim())
      return "Please fill in all fields.";
    if (!file) return "Please select a file.";
    const ext = file.name.split(".").pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) return "Invalid file type. Only PDF, DOC, DOCX and EPUB are allowed.";
    if (file.size > MAX_FILE_SIZE) return "File is too large. Maximum size is 20 MB.";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const problem = validate();
    if (problem) return setError(problem);

    setBusy(true);
    setProgress(0);
    let storagePath = "";
    try {
      // 1. Upload the file to Supabase Storage
      const result = await uploadBookFile(user.uid, file, setProgress);
      storagePath = result.storagePath;

      // 2. Save the metadata in Supabase Database
      await addBook({
        userId: user.uid,
        title: form.title.trim(),
        author: form.author.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        fileName: file.name,
        fileType: file.name.split(".").pop().toUpperCase(),
        fileSize: file.size,
        fileUrl: result.fileUrl,
        storagePath: result.storagePath,
      });

      navigate("/my-books", { state: { success: "Book uploaded successfully!" } });
    } catch (err) {
      // If the database save failed, remove the orphaned file
      if (storagePath) deleteBookFile(storagePath).catch(() => {});
      setError(friendlyError(err));
      setBusy(false);
    }
  }

  return (
    <div className="form-page">
      <form className="card form wide" onSubmit={handleSubmit} noValidate>
        <h2>Upload Book</h2>
        {error && <div className="alert alert-error">{error}</div>}

        <label>Book Title</label>
        <input name="title" value={form.title} onChange={handleChange} />

        <label>Author</label>
        <input name="author" value={form.author} onChange={handleChange} />

        <label>Category</label>
        <input name="category" value={form.category} onChange={handleChange} />

        <label>Description</label>
        <textarea name="description" rows="4" value={form.description} onChange={handleChange} />

        <label>Select File (PDF, DOC, DOCX, EPUB - max 20 MB)</label>
        <input type="file" accept=".pdf,.doc,.docx,.epub" onChange={(e) => setFile(e.target.files[0])} />

        {busy && (
          <div>
            <div className="progress">
              <div className="progress-bar" style={{ width: `${progress}%` }} />
            </div>
            <p className="muted small">Uploading... {progress}%</p>
          </div>
        )}

        <button className="btn" disabled={busy}>
          {busy ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
