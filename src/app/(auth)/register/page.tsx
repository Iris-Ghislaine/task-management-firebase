// src/app/register/page.tsx
"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/app/lib/firebase";
import Link from "next/link";
import { Mail, Lock, UserPlus, Lightbulb, ArrowLeft } from "lucide-react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Redirect to login after successful registration
      router.push("/login");
    } catch (error: any) {
      if (error.code === "auth/weak-password") {
        setError("Password should be at least 6 characters");
      } else if (error.code === "auth/email-already-in-use") {
        setError("This email is already registered. Try logging in.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address");
      } else {
        setError("Failed to create account. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* CARD */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-slate-100 relative">
          <Link
            href="/login"
            className="absolute top-6 left-6 p-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all"
          >
            <ArrowLeft className="h-6 w-6 text-slate-600" />
          </Link>
          <div className="text-center mb-10 mt-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg mb-6">
              <UserPlus className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-slate-600 mt-3 text-lg">
              Join and start organizing your tasks
            </p>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-lg placeholder-slate-500"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (6+ characters)"
                required
                minLength={6}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-lg placeholder-slate-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-4 rounded-xl shadow-xl transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="h-6 w-6" />
                  Create Account
                </>
              )}
            </button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-slate-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-emerald-600 hover:text-teal-600 transition-colors underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
          <div className="mt-10 flex items-center justify-center gap-3 text-sm text-slate-500 bg-slate-50 rounded-xl p-4">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <span>
              <strong>Demo Account:</strong> demo@gmail.com / 123456
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}