import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { downloadBook, formatDate, formatSize, getBook } from "../services/bookService";
import { friendlyError } from "../services/errorMessages";
import Loading from "../components/Loading";

export default function BookDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setBook(await getBook(id, user.uid));
      } catch (err) {
        setError(friendlyError(err));
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <Loading />;

  if (error || !book) {
    return (
      <div className="container">
        <div className="alert alert-error">{error || "Book not found."}</div>
        <Link className="btn btn-light" to="/my-books">
          Back to My Books
        </Link>
      </div>
    );
  }

  const isPdf = book.fileType === "PDF";

  return (
    <div className="container">
      <div className="card details">
        <h1>{book.title}</h1>
        <p><strong>Author:</strong> {book.author}</p>
        <p><strong>Category:</strong> {book.category}</p>
        <p><strong>Description:</strong> {book.description}</p>
        <p><strong>File Type:</strong> {book.fileType}</p>
        <p><strong>File Size:</strong> {formatSize(book.fileSize)}</p>
        <p><strong>Upload Date:</strong> {formatDate(book.createdAt)}</p>

        {!isPdf && (
          <p className="muted small">
            {book.fileType} files cannot be previewed in the browser. Please download the book to read it.
          </p>
        )}

        <div className="actions">
          {isPdf && (
            <a className="btn" href={book.fileUrl} target="_blank" rel="noopener noreferrer">
              Open Book
            </a>
          )}
          <button className="btn btn-light" onClick={() => downloadBook(book)}>
            Download Book
          </button>
          <Link className="btn btn-light" to="/my-books">
            Back to My Books
          </Link>
        </div>
      </div>
    </div>
  );
}
