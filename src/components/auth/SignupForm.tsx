"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import GoogleSignInButton from "./GoogleSignInButton";
import Link from "next/link";

const SPECIAL_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

const requirements = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  {
    label: `One special character (!@#$%^&*()_+-=[]{}|;:,.<>?)`,
    test: (p: string) => /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(p),
  },
];

const allMet = (p: string) => requirements.every((r) => r.test(p));

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const showRequirements =
    passwordFocused || (password.length > 0 && !allMet(password));
  const passwordValid = allMet(password);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!passwordValid) {
      setError("Password must meet all requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/messages");
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <div className="animate-fade-slide-up delay-100">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Create an account
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
          Sign up to get started
        </p>
      </div>

      {error && (
        <div className="animate-fade-slide-up bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <div className="animate-fade-slide-up delay-200 flex flex-col gap-1.5">
          <label
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            htmlFor="username"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="animate-fade-slide-up delay-300 flex flex-col gap-1.5">
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

        <div className="animate-fade-slide-up delay-400 flex flex-col gap-1.5">
          <label
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              required
              className="w-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 rounded-lg px-3 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {passwordValid && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 dark:text-green-400 text-base">
                ✓
              </span>
            )}
          </div>
          {showRequirements && (
            <ul className="flex flex-col gap-1 mt-1">
              {requirements.map((req) => {
                const met = req.test(password);
                return (
                  <li
                    key={req.label}
                    className={`flex items-center gap-2 text-xs ${met ? "text-green-500 dark:text-green-400" : "text-zinc-400 dark:text-zinc-500"}`}
                  >
                    <span>{met ? "✓" : "○"}</span>
                    {req.label}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="animate-fade-slide-up delay-500 flex flex-col gap-1.5">
          <label
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="animate-fade-slide-up delay-600">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </div>
      </form>

      <div className="animate-fade-slide-up delay-700 flex items-center gap-3">
        <div className="flex-1 h-px bg-zinc-300 dark:bg-zinc-700" />
        <span className="text-zinc-400 dark:text-zinc-500 text-xs">or</span>
        <div className="flex-1 h-px bg-zinc-300 dark:bg-zinc-700" />
      </div>

      <div
        className="animate-fade-slide-up"
        style={{ animationDelay: "800ms" }}
      >
        <GoogleSignInButton label="Sign up with Google" />
      </div>

      <p
        className="animate-fade-slide-up text-zinc-500 dark:text-zinc-400 text-sm text-center"
        style={{ animationDelay: "900ms" }}
      >
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
