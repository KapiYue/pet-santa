import { type Metadata } from "next";
import Link from "next/link";
import SignUpForm from "./form";
import { ArrowLeft, PawPrint } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignUpPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-50/50 p-4 py-10 text-slate-800">
      {/* Festive background ornaments */}
      <div className="pointer-events-none absolute left-10 top-16 select-none text-7xl text-red-100">
        🔔
      </div>
      <div className="pointer-events-none absolute bottom-16 right-12 select-none text-8xl text-red-100">
        🎁
      </div>

      {/* Brand logo */}
      <Link href="/" className="group z-10 mb-8 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 shadow-md transition-transform group-hover:scale-105">
          <PawPrint className="h-6 w-6 text-white" />
        </span>
        <span className="bg-gradient-to-r from-red-600 to-red-500 bg-clip-text font-serif text-3xl font-bold italic tracking-tight text-transparent">
          Pets Santa
        </span>
      </Link>

      {/* Auth card */}
      <div className="z-10 w-full max-w-md rounded-3xl border border-slate-100 bg-white px-8 py-8 shadow-xl">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Join Pets Santa and start making festive pet portraits
          </p>
        </div>

        <SignUpForm />

        <div className="flex items-center justify-center gap-2">
          <small className="text-sm text-slate-500">
            Already have an account?
          </small>
          <Link
            href="/signin"
            className="text-sm font-bold text-red-600 hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Back to home */}
      <Link
        href="/"
        className="z-10 mt-6 flex items-center gap-1.5 text-sm font-semibold text-slate-400 transition-colors hover:text-slate-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>
    </div>
  );
}
