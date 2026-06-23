'use client';

import React from 'react';
import { Mail, UserPlus, PawPrint, X } from 'lucide-react';
import Link from 'next/link';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-100 bg-white px-8 py-9 text-slate-800 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 text-slate-400 transition-colors hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Paw icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <PawPrint className="h-7 w-7 text-red-600" />
        </div>

        {/* Heading */}
        <div className="text-center">
          <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Log in to save and download
          </h3>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
            Sign in to keep your creations and unlock premium quality for your
            pet portraits.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          <button
            type="button"
            onClick={() => alert('Continuing with Google...')}
            className="flex w-full items-center justify-center gap-2.5 rounded-full border border-slate-200 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <span className="bg-white px-3">Or</span>
            </div>
          </div>

          <Link
            href="/signin"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2.5 rounded-full border border-slate-200 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
          >
            <Mail className="h-4 w-4" />
            Sign in with Email
          </Link>

          <Link
            href="/signup"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2.5 rounded-full bg-red-600 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-red-700 hover:shadow-lg"
          >
            <UserPlus className="h-4 w-4" />
            Create an Account
          </Link>
        </div>

        {/* Footer */}
        <p className="mx-auto mt-7 max-w-xs text-center text-[10px] font-semibold uppercase leading-relaxed tracking-wider text-slate-400">
          Powered by Better Auth. By continuing, you agree to our Terms of
          Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
