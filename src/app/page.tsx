"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  return <h1>Hello, {user.email}</h1>; // Placeholder for now
}