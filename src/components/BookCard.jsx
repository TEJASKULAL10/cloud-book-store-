import { Link } from "react-router-dom";
import { downloadBook, formatDate } from "../services/bookService";

export default function BookCard({ book, onDelete }) {
  return (
    <div className="card book-card">
      <h3>{book.title}</h3>
      <p className="muted">by {book.author}</p>
      <p>
        <span className="tag">{book.category}</span> <span className="tag">{book.fileType}</span>
      </p>
      <p className="muted small">Uploaded {formatDate(book.createdAt)}</p>
      <div className="actions">
        <Link className="btn btn-small" to={`/books/${book.id}`}>
          View
        </Link>
        <button className="btn btn-small btn-light" onClick={() => downloadBook(book)}>
          Download
        </button>
        <button className="btn btn-small btn-danger" onClick={() => onDelete(book)}>
          Delete
        </button>
      </div>
    </div>
  );
}
