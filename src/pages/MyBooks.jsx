import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { deleteBook, getUserBooks } from "../services/bookService";
import { friendlyError } from "../services/errorMessages";
import BookCard from "../components/BookCard";
import Loading from "../components/Loading";

export default function MyBooks() {
  const { user } = useAuth();
  const location = useLocation();
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(
    location.state?.success ? { type: "success", text: location.state.success } : { type: "", text: "" }
  );

  async function loadBooks() {
    try {
      setBooks(await getUserBooks(user.uid));
    } catch (err) {
      setMessage({ type: "error", text: friendlyError(err) });
    }
    setLoading(false);
  }

  useEffect(() => {
    loadBooks();
  }, []);

  async function handleDelete(book) {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await deleteBook(book, user.uid);
      setMessage({ type: "success", text: "Book deleted successfully." });
      await loadBooks();
    } catch (err) {
      setMessage({ type: "error", text: friendlyError(err) });
    }
  }

  // Simple search: title, author or category contains the text
  const term = search.trim().toLowerCase();
  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(term) ||
      b.author.toLowerCase().includes(term) ||
      b.category.toLowerCase().includes(term)
  );

  return (
    <div className="container">
      <h1>My Books</h1>
      <input
        className="search"
        placeholder="Search by title, author or category"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

      {loading ? (
        <Loading />
      ) : books.length === 0 ? (
        <p className="muted">You have not uploaded any books yet.</p>
      ) : filtered.length === 0 ? (
        <p className="muted">No books match your search.</p>
      ) : (
        <div className="grid">
          {filtered.map((b) => (
            <BookCard key={b.id} book={b} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
