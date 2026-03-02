import SignupForm from "@/components/auth/SignupForm";
import ThemeToggle from "@/components/ThemeToggle";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 dark:bg-zinc-900">
      <ThemeToggle />
      <div className="bg-white/80 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/50 backdrop-blur-sm rounded-2xl px-8 py-10 w-full max-w-sm shadow-xl shadow-black/10 dark:shadow-black/30">
        <SignupForm />
      </div>
    </main>
  );
}
