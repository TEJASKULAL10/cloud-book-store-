// Turns error objects/messages into simple text for users.
export function friendlyError(error) {
  if (typeof error === "string") return error;
  const msg = error?.message || error?.friendlyMessage || error?.code || "";

  if (msg.includes("Invalid login credentials") || msg.includes("auth/invalid-credential")) {
    return "Incorrect email or password.";
  }
  if (msg.includes("User already registered") || msg.includes("email-already-in-use")) {
    return "An account with this email already exists.";
  }
  if (msg.includes("Password should be at least") || msg.includes("weak-password")) {
    return "Password is too weak. Use at least 6 characters.";
  }
  if (msg.includes("Unable to validate email address") || msg.includes("invalid-email")) {
    return "Please enter a valid email address.";
  }
  if (msg.includes("Failed to fetch") || msg.includes("network")) {
    return "Network error. Please check your internet connection and Supabase URL.";
  }
  if (msg.includes("relation \"public.books\" does not exist")) {
    return "Database table 'books' does not exist yet. Please run the setup SQL in Supabase.";
  }
  if (msg.includes("row-level security policy")) {
    return "Permission denied. Check RLS policies on the Supabase database.";
  }

  return error?.friendlyMessage || error?.message || "Something went wrong. Please try again.";
}
