"use client";

import { useState } from "react";
import Link from "next/link";
import { setAuthSession } from "@/lib/auth";

export default function SeoLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/seo/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || "Unable to sign in.");
      setAuthSession(data.token, data.user);
      // A fresh server request updates the administrator navigation permission.
      window.location.assign("/status");
    } catch (failure) { setError(failure.message); setBusy(false); }
  }

  return (
    <section className="min-h-[85vh] bg-slate-50 px-4 py-16 flex items-center justify-center">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <p className="text-sm font-semibold text-emerald-700">Green Fibre / Website SEO</p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">SEO Administrator Sign In</h1>
        <p className="mt-3 text-sm text-slate-600">Sign in with your approved marketing account to manage search metadata and social sharing.</p>
        <form onSubmit={submit} className="mt-6 space-y-5">
          <fieldset disabled={busy} className="space-y-5">
            <div><label htmlFor="seo-login-email" className="text-sm font-semibold">Administrator email</label><input id="seo-login-email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 focus:ring-2 focus:ring-emerald-200" /></div>
            <div><label htmlFor="seo-login-password" className="text-sm font-semibold">Password</label><input id="seo-login-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 focus:ring-2 focus:ring-emerald-200" /></div>
          </fieldset>
          {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
          <button disabled={busy} className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white disabled:opacity-60">{busy ? "Signing in…" : "Sign in to SEO"}</button>
        </form>
        <p className="mt-5 text-xs text-slate-500">Use the existing password for your approved account. SEO access is restricted to website administrators.</p>
        <Link href="/" className="mt-5 inline-block text-sm text-emerald-700 underline">Return to website</Link>
      </div>
    </section>
  );
}
