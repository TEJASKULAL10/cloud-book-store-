import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { deleteBook, getUserBooks, downloadBook, formatDate, formatSize } from "../services/bookService";
import { friendlyError } from "../services/errorMessages";
import BookCard from "../components/BookCard";
import Loading from "../components/Loading";

export default function Dashboard() {
  const { user, userName } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Filtering & Sorting State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'

  // Modal State for Delete Confirmation
  const [bookToDelete, setBookToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Time-of-day greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  async function loadBooks(showRefresh = false) {
    if (showRefresh) setRefreshing(true);
    try {
      const data = await getUserBooks(user.uid);
      setBooks(data);
    } catch (err) {
      setMessage({ type: "error", text: friendlyError(err) });
    } finally {
      setLoading(false);
      if (showRefresh) setRefreshing(false);
    }
  }

  useEffect(() => {
    loadBooks();
  }, [user.uid]);

  // Handle Delete Modal
  function handleRequestDelete(book) {
    setBookToDelete(book);
  }

  async function confirmDelete() {
    if (!bookToDelete) return;
    setDeleting(true);
    try {
      await deleteBook(bookToDelete, user.uid);
      setMessage({ type: "success", text: `"${bookToDelete.title}" has been deleted.` });
      setBookToDelete(null);
      await loadBooks();
    } catch (err) {
      setMessage({ type: "error", text: friendlyError(err) });
    } finally {
      setDeleting(false);
    }
  }

  // Derive Unique Categories
  const categories = useMemo(() => {
    const set = new Set();
    books.forEach((b) => {
      if (b.category && b.category.trim()) {
        set.add(b.category.trim());
      }
    });
    return Array.from(set);
  }, [books]);

  // Compute Metrics
  const stats = useMemo(() => {
    const total = books.length;
    const catCount = categories.length;
    const formats = {};
    books.forEach((b) => {
      const ext = (b.fileType || "pdf").toUpperCase();
      formats[ext] = (formats[ext] || 0) + 1;
    });
    const popularFormat = Object.keys(formats).sort((a, b) => formats[b] - formats[a])[0] || "PDF";
    return {
      total,
      catCount,
      popularFormat,
    };
  }, [books, categories]);

  // Filter and Sort Books
  const processedBooks = useMemo(() => {
    return books
      .filter((book) => {
        const term = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !term ||
          book.title?.toLowerCase().includes(term) ||
          book.author?.toLowerCase().includes(term) ||
          book.category?.toLowerCase().includes(term);

        const matchesCategory =
          selectedCategory === "all" ||
          book.category?.toLowerCase() === selectedCategory.toLowerCase();

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        if (sortBy === "oldest") {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
        if (sortBy === "title-asc") {
          return (a.title || "").localeCompare(b.title || "");
        }
        if (sortBy === "author-asc") {
          return (a.author || "").localeCompare(b.author || "");
        }
        return 0;
      });
  }, [books, searchTerm, selectedCategory, sortBy]);

  return (
    <div className="container dashboard-wrapper">
      {/* Alert Notifications */}
      {message.text && (
        <div className={`alert alert-${message.type}`} role="alert">
          <span className="alert-icon">
            {message.type === "success" ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
          </span>
          <div style={{ flex: 1 }}>{message.text}</div>
          <button
            onClick={() => setMessage({ type: "", text: "" })}
            style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", padding: 0 }}
            aria-label="Dismiss alert"
          >
            ✕
          </button>
        </div>
      )}

      {/* Hero Welcome Banner */}
      <section className="dashboard-hero">
        <div className="dashboard-hero-content">
          <div className="dashboard-hero-greeting">
            <span>👋</span>
            <span>
              {greeting}, {userName || "Reader"}
            </span>
          </div>
          <h1>Welcome to Your Library</h1>
          <p>
            Manage your personal cloud books, monitor sync status, and continue reading from any device.
          </p>
        </div>

        <div className="dashboard-hero-actions">
          <button
            className="btn btn-hero-secondary"
            onClick={() => loadBooks(true)}
            disabled={refreshing}
            title="Refresh Bookshelf"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }}
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            <span>{refreshing ? "Syncing..." : "Sync"}</span>
          </button>

          <Link to="/upload" className="btn btn-hero-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Upload New Book</span>
          </Link>
        </div>
      </section>

      {/* Stats Cards Section */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-indigo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <div className="stat-data">
            <span className="stat-label">Total Books</span>
            <span className="stat-number">{stats.total}</span>
            <span className="stat-sub">In your cloud library</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-purple">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <div className="stat-data">
            <span className="stat-label">Categories</span>
            <span className="stat-number">{stats.catCount}</span>
            <span className="stat-sub">Unique genres active</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-emerald">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div className="stat-data">
            <span className="stat-label">Top Format</span>
            <span className="stat-number">{books.length ? stats.popularFormat : "—"}</span>
            <span className="stat-sub">Standardized reading</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-amber">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
            </svg>
          </div>
          <div className="stat-data">
            <span className="stat-label">Cloud Status</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#10b981",
                  boxShadow: "0 0 8px #10b981",
                  display: "inline-block",
                }}
              />
              <strong style={{ fontSize: "1.2rem", color: "var(--text-main)" }}>Connected</strong>
            </div>
            <span className="stat-sub">Supabase live storage</span>
          </div>
        </div>
      </section>

      {/* Interactive Toolbar */}
      <section className="dashboard-toolbar">
        <div className="toolbar-top">
          <div className="search-box-container">
            <div className="input-wrapper">
              <span className="input-icon-left">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                type="text"
                className="has-icon-left"
                placeholder="Search by title, author, or genre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setSearchTerm("")}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="toolbar-right-actions">
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort books"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title-asc">Title (A - Z)</option>
              <option value="author-asc">Author (A - Z)</option>
            </select>

            <div className="view-mode-toggle">
              <button
                className={`view-mode-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Grid View"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                <span>Grid</span>
              </button>
              <button
                className={`view-mode-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                title="List View"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
                <span>List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Category Filter Pills */}
        {categories.length > 0 && (
          <div className="category-pills">
            <button
              className={`category-pill ${selectedCategory === "all" ? "active" : ""}`}
              onClick={() => setSelectedCategory("all")}
            >
              All Categories ({books.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-pill ${
                  selectedCategory.toLowerCase() === cat.toLowerCase() ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Main Books Content Area */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner" />
          <p className="muted">Fetching your digital bookshelf from cloud...</p>
        </div>
      ) : books.length === 0 ? (
        /* Empty State: No Books uploaded yet */
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <h3>Your Library is Empty</h3>
          <p>
            You haven't uploaded any books to your personal cloud yet. Start building your collection now!
          </p>
          <Link to="/upload" className="btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Upload Your First Book</span>
          </Link>
        </div>
      ) : processedBooks.length === 0 ? (
        /* Empty State: Search or category filter returned 0 results */
        <div className="empty-state">
          <div className="empty-state-icon" style={{ background: "#fef3c7", color: "#b45309" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h3>No matching books found</h3>
          <p>
            No results match your search query "{searchTerm}" {selectedCategory !== "all" && `in category "${selectedCategory}"`}.
          </p>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* Books Grid Display */
        <div className="books-grid">
          {processedBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onDelete={() => handleRequestDelete(book)}
            />
          ))}
        </div>
      ) : (
        /* Books List Display */
        <div className="books-list">
          {processedBooks.map((book) => (
            <div key={book.id} className="book-row-premium">
              <div className="book-row-left">
                <div
                  className="book-spine-thumb"
                  style={{ width: 42, height: 50 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: "1.05rem", margin: "0 0 3px 0" }}>{book.title}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span className="muted small">by {book.author}</span>
                    <span className="badge badge-primary">{book.category}</span>
                    <span className="badge badge-secondary">{(book.fileType || "pdf").toUpperCase()}</span>
                    {book.fileSize && (
                      <span className="badge badge-emerald">{formatSize(book.fileSize)}</span>
                    )}
                    <span className="muted small">Uploaded {formatDate(book.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="book-row-actions">
                <Link className="btn btn-small btn-secondary" to={`/books/${book.id}`}>
                  View
                </Link>
                <button
                  className="btn btn-small btn-light"
                  onClick={() => downloadBook(book)}
                  title="Download book"
                >
                  Download
                </button>
                <button
                  className="btn btn-small btn-danger"
                  onClick={() => handleRequestDelete(book)}
                  title="Delete book"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sleek Modal Delete Confirmation */}
      {bookToDelete && (
        <div className="modal-overlay" onClick={() => !deleting && setBookToDelete(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon-danger">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </div>
            <h2>Delete Book?</h2>
            <p style={{ margin: "10px 0 20px" }}>
              Are you sure you want to delete <strong>"{bookToDelete.title}"</strong>? This will permanently remove the file from your Supabase cloud storage.
            </p>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setBookToDelete(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                style={{ background: "#dc2626", color: "#ffffff", borderColor: "#dc2626" }}
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
