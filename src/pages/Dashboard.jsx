import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { deleteBook, getUserBooks } from "../services/bookService";
import { friendlyError } from "../services/errorMessages";
import BookCard from "../components/BookCard";
import Loading from "../components/Loading";

export default function Dashboard() {
  const { user, userName } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

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

  return (
    <div className="container">
      <h1>Welcome, {userName}</h1>

      <div className="card stat">
        <span className="muted">Total Books</span>
        <strong>{books.length}</strong>
      </div>

      {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

      <h2>Your Books</h2>
      {loading ? (
        <Loading />
      ) : books.length === 0 ? (
        <p className="muted">You have not uploaded any books yet. Use Upload Book to add one.</p>
      ) : (
        <div className="grid">
          {books.map((b) => (
            <BookCard key={b.id} book={b} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
