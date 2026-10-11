import { supabase } from "../supabase/supabaseClient";

const BUCKET = import.meta.env.VITE_SUPABASE_BUCKET || "books";

function storageError(message) {
  const err = new Error(message);
  err.friendlyMessage = message;
  return err;
}

// Uploads a file to {userId}/{uniqueFileName} inside the Supabase Storage bucket.
export async function uploadBookFile(userId, file, onProgress) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `${userId}/${crypto.randomUUID()}_${safeName}`;

  if (onProgress) onProgress(20);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw storageError(error.message || "Upload failed. Please check storage policies.");
  }

  if (onProgress) onProgress(100);

  const { data: publicUrlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(storagePath);

  return {
    fileUrl: publicUrlData.publicUrl,
    storagePath,
  };
}

export async function deleteBookFile(storagePath) {
  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([storagePath]);

  if (error) {
    throw storageError(error.message || "Could not delete the file from storage.");
  }
}
