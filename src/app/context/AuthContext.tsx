"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";
import { User } from "firebase/auth";

interface AuthContextType {
  user: User | null | undefined;
  loading: boolean;
  idToken: string | null;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, idToken: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, loading] = useAuthState(auth);
  const [idToken, setIdToken] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      user.getIdToken().then((token) => {
        setIdToken(token);
      });
    } else {
      setIdToken(null);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, idToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);