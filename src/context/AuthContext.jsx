import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session on initial render
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user || null;
      if (currentUser) {
        const enrichedUser = { ...currentUser, uid: currentUser.id };
        setUser(enrichedUser);
        setUserName(currentUser.user_metadata?.name || currentUser.email || "");
      } else {
        setUser(null);
        setUserName("");
      }
      setLoading(false);
    });

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user || null;
      if (currentUser) {
        const enrichedUser = { ...currentUser, uid: currentUser.id };
        setUser(enrichedUser);
        setUserName(currentUser.user_metadata?.name || currentUser.email || "");
      } else {
        setUser(null);
        setUserName("");
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={{ user, userName, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
