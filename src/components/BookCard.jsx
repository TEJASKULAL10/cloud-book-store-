import { Link } from "react-router-dom";
import { downloadBook, formatDate, formatSize } from "../services/bookService";

export default function BookCard({ book, onDelete }) {
  const ext = (book.fileType || "pdf").toUpperCase();

  return (
    <div className="book-card-premium">
      <div className="book-card-header">
        <div className="book-spine-thumb">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <span style={{ fontSize: "0.6rem", fontWeight: 700, marginTop: 4 }}>{ext}</span>
        </div>

        <div className="book-info-area">
          <h3 className="book-card-title" title={book.title}>
            {book.title}
          </h3>
          <p className="book-card-author">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>{book.author}</span>
          </p>
          <div className="book-tags-row">
            <span className="badge badge-primary">{book.category}</span>
            <span className="badge badge-secondary">{ext}</span>
            {book.fileSize && (
              <span className="badge badge-emerald">{formatSize(book.fileSize)}</span>
            )}
          </div>
        </div>
      </div>

      <div className="book-card-body">
        <span>Uploaded {formatDate(book.createdAt)}</span>
        {book.description && (
          <span
            title={book.description}
            style={{
              maxWidth: "140px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {book.description}
          </span>
        )}
      </div>

      <div className="book-card-actions">
        <Link className="btn btn-small btn-secondary" to={`/books/${book.id}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span>View</span>
        </Link>

        <button
          className="btn btn-small btn-light"
          onClick={() => downloadBook(book)}
          title="Download file"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Download</span>
        </button>

        <button
          className="btn btn-small btn-danger"
          onClick={() => onDelete(book)}
          title="Delete book"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
