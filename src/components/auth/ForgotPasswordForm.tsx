"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col gap-4 text-center animate-fade-slide-up delay-100">
        <div className="text-4xl">📬</div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Check your email
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          We sent a password reset link to{" "}
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            {email}
          </span>
          . It may take a few minutes to arrive.
        </p>
        <Link
          href="/login"
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 text-sm font-medium mt-2"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <div className="animate-fade-slide-up delay-100">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Forgot password?
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      {error && (
        <div className="animate-fade-slide-up bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="animate-fade-slide-up delay-200 flex flex-col gap-1.5">
          <label
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="animate-fade-slide-up delay-300">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </div>
      </form>

      <p className="animate-fade-slide-up delay-400 text-zinc-500 dark:text-zinc-400 text-sm text-center">
        <Link
          href="/login"
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
