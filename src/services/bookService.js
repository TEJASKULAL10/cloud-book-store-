import { supabase } from "../supabase/supabaseClient";
import { deleteBookFile } from "./storageService";

export const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx", "epub"];
export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

function mapBookFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    author: row.author,
    category: row.category,
    description: row.description,
    fileName: row.file_name,
    fileType: row.file_type,
    fileSize: row.file_size,
    fileUrl: row.file_url,
    storagePath: row.storage_path,
    createdAt: row.created_at,
  };
}

export async function addBook(data) {
  const { data: inserted, error } = await supabase
    .from("books")
    .insert([
      {
        user_id: data.userId,
        title: data.title,
        author: data.author,
        category: data.category,
        description: data.description,
        file_name: data.fileName,
        file_type: data.fileType,
        file_size: data.fileSize,
        file_url: data.fileUrl,
        storage_path: data.storagePath,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return mapBookFromDb(inserted);
}

// Returns books for a specific user
export async function getUserBooks(userId) {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapBookFromDb);
}

// Returns book details if user owns it
export async function getBook(bookId, userId) {
  try {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("id", bookId)
      .eq("user_id", userId)
      .single();

    if (error || !data) return null;
    return mapBookFromDb(data);
  } catch {
    return null;
  }
}

// Deletes the file from Storage, then the record from Database
export async function deleteBook(book, userId) {
  if (book.userId !== userId) {
    const err = new Error("Not allowed");
    err.friendlyMessage = "You can only delete your own books.";
    throw err;
  }
  await deleteBookFile(book.storagePath);
  const { error } = await supabase.from("books").delete().eq("id", book.id);
  if (error) throw error;
}

// Downloads the file to the user's device
export function downloadBook(book) {
  const a = document.createElement("a");
  a.href = `${book.fileUrl}?download=${encodeURIComponent(book.fileName)}`;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function formatSize(bytes) {
  if (!bytes) return "0 KB";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDate(timestamp) {
  if (!timestamp) return "-";
  const date = typeof timestamp?.toDate === "function" ? timestamp.toDate() : new Date(timestamp);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
