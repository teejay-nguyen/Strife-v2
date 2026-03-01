"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });
    if (error) setError(error.message);
    else router.push("/messages");
  };

  return (
    <form
      onSubmit={handleSignup}
      className="flex flex-col gap-4 w-full max-w-sm"
    >
      <h1 className="text-2xl font-bold">Create an account</h1>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <input
        className="border p-2 rounded"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        className="border p-2 rounded"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className="border p-2 rounded"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
        type="submit"
      >
        Sign Up
      </button>
    </form>
  );
}
