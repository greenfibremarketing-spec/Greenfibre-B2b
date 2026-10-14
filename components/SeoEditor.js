"use client";

import { useEffect, useState } from "react";
import { SEO_FIELDS, SITE_URL } from "@/lib/seo-config";

export default function SeoEditor() {
  const [pagePath, setPagePath] = useState("/");
  const [pages, setPages] = useState([{ path: "/", label: "Homepage" }]);
  const [settings, setSettings] = useState(null);
  const [defaults, setDefaults] = useState({});
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setSettings(null);
    setError("");
    setMessage("");
    fetch(`/api/seo?path=${encodeURIComponent(pagePath)}&pages=1`, { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load SEO settings.");
        setSettings(data.settings);
        setDefaults(data.defaults);
        setPages(data.pages);
        setUpdatedAt(data.updatedAt);
        setDirty(false);
      })
      .catch((failure) => { if (failure.name !== "AbortError") setError(failure.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [pagePath, reload]);

  useEffect(() => {
    const guard = (event) => { if (dirty) { event.preventDefault(); event.returnValue = ""; } };
    window.addEventListener("beforeunload", guard);
    // Protect edits when using the site's navigation links as well as browser reloads.
    const guardLink = (event) => {
      const link = event.target.closest?.("a[href]");
      if (dirty && link && link.target !== "_blank" && !window.confirm("Leave this page and discard unsaved SEO changes?")) event.preventDefault();
    };
    document.addEventListener("click", guardLink, true);
    return () => { window.removeEventListener("beforeunload", guard); document.removeEventListener("click", guardLink, true); };
  }, [dirty]);

  function change(key, value) {
    setSettings((previous) => ({ ...previous, [key]: value }));
    setDirty(true);
    setMessage("");
  }

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/seo", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path: pagePath, settings }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save SEO settings.");
      setSettings(data.settings);
      setUpdatedAt(data.updatedAt);
      setDirty(false);
      setMessage("SEO saved. The new settings are now used when this page is rendered.");
    } catch (failure) { setError(failure.message); }
    finally { setBusy(false); }
  }

  async function upload(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("Image must be smaller than 5 MB."); return; }
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/seo/image", { method: "POST", headers: { "Content-Type": file.type }, body: file });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed.");
      change("socialImage", data.url);
      setMessage("Image uploaded. Save SEO to publish it on this page.");
    } catch (failure) { setError(failure.message); }
    finally { setBusy(false); }
  }

  const effective = (key) => settings?.[key] || defaults[key] || "";
  const title = effective("title");
  const description = effective("description");
  const focusKeyword = settings?.focusKeyword?.trim().toLowerCase();
  const inputClass = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50";

  return (
    <section className="bg-slate-50 min-h-screen px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-sm font-semibold text-emerald-700">Status / SEO</p><h1 className="mt-2 text-3xl font-bold text-slate-900">Website SEO</h1><p className="mt-2 text-sm text-slate-600">Manage search results and social sharing for each page.</p></div>
          <a href={pagePath} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold bg-white">View page ↗</a>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <label htmlFor="seo-page" className="text-sm font-semibold">Page to edit</label>
          <select id="seo-page" className={inputClass} value={pagePath} disabled={busy || loading} onChange={(event) => {
            if (dirty && !window.confirm("Switch pages and discard unsaved SEO changes?")) return;
            setPagePath(event.target.value);
          }}>{pages.map((page) => <option key={page.path} value={page.path}>{page.label} — {page.path}</option>)}</select>
          <p className="mt-2 text-xs text-slate-500">Blank text fields use the page’s existing SEO. Focus Keyword is for your editorial reference.</p>
        </div>
        {error && <div role="alert" className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-800">{error} {(!settings || loading) && <button type="button" onClick={() => setReload((value) => value + 1)} className="underline ml-2">Retry</button>}</div>}
        {message && <div role="status" className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-900">{message}</div>}
        {loading ? <p role="status" className="py-10 text-center text-slate-500">Loading SEO settings…</p> : settings && (
          <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
            <form onSubmit={save} className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 space-y-6">
              <fieldset disabled={busy} className="space-y-6">
                <legend className="text-xl font-bold mb-5">SEO</legend>
                {Object.entries(SEO_FIELDS).map(([key, field]) => (
                  <div key={key}>
                    <div className="flex items-center justify-between gap-2"><label htmlFor={`seo-${key}`} className="text-sm font-semibold text-slate-800">{field.label}</label>{["title", "description"].includes(key) && <span className="text-xs text-slate-500">{settings[key]?.length || 0} characters</span>}</div>
                    {field.multiline ? <textarea id={`seo-${key}`} value={settings[key] || ""} placeholder={defaults[key]} maxLength={field.max} rows={key === "keywords" ? 7 : 3} className={inputClass} onChange={(event) => change(key, event.target.value)} /> : <input id={`seo-${key}`} type="text" value={settings[key] || ""} placeholder={defaults[key]} maxLength={field.max} className={inputClass} onChange={(event) => change(key, event.target.value)} />}
                    {key === "keywords" && <p className="mt-1 text-xs text-slate-500">One keyword per line. Duplicate keywords are removed when you save.</p>}
                    {key === "socialImage" && <div className="mt-3 space-y-3"><label className="block text-sm text-slate-600">Upload a social share image<input aria-label="Upload social share image" type="file" accept="image/png,image/jpeg,image/webp" onChange={upload} className="block mt-2 text-xs w-full" /></label><p className="text-xs text-slate-500">PNG, JPEG or WebP, up to 5 MB. Recommended size: 1200 × 630.</p>{effective("socialImage") && <img src={effective("socialImage")} alt="Social share image preview" className="w-full max-w-sm aspect-[1200/630] object-cover rounded-xl border border-slate-200" />}</div>}
                  </div>
                ))}
                <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={Boolean(settings.noindex)} onChange={(event) => change("noindex", event.target.checked)} className="rounded text-emerald-700" />Hide from Google (noindex)</label>
                <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={Boolean(settings.nofollow)} onChange={(event) => change("nofollow", event.target.checked)} className="rounded text-emerald-700" />Disable Link Following (nofollow)</label>
              </fieldset>
              <div className="border-t border-slate-100 pt-5 flex flex-wrap gap-3 items-center justify-between">
                <p className="text-xs text-slate-500">{dirty ? "Unsaved changes" : updatedAt ? `Last saved: ${new Date(updatedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST` : "Using existing page SEO"}</p>
                <button type="submit" disabled={busy || !dirty} className="rounded-xl px-6 py-3 bg-emerald-700 text-white font-semibold text-sm hover:bg-emerald-800 disabled:opacity-50">{busy ? "Saving…" : "Save SEO"}</button>
              </div>
            </form>
            <aside className="space-y-5 lg:sticky lg:top-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3"><h2 className="font-bold">Search preview</h2><p className="text-xs text-slate-600 break-all">{effective("canonical") || `${SITE_URL}${pagePath}`}</p><p className="text-lg text-blue-800 break-words">{title}</p><p className="text-sm text-slate-600 break-words">{description}</p><p className="text-xs text-slate-400">Search engines may choose a different title or description.</p></div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3"><h2 className="font-bold">Social preview</h2>{effective("socialImage") && <img src={effective("socialImage")} alt="Social card preview" className="w-full aspect-[1200/630] object-cover rounded-lg" />}<p className="font-semibold text-sm break-words">{effective("ogTitle") || title}</p><p className="text-xs text-slate-600 break-words">{effective("ogDescription") || description}</p></div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-sm space-y-2"><h2 className="font-bold">Page status</h2><p>{settings.noindex ? "Hidden from search indexing" : "Search indexing allowed"}</p><p>{settings.nofollow ? "Link following disabled" : "Link following allowed"}</p>{focusKeyword && <><p>Focus keyword in title: {title.toLowerCase().includes(focusKeyword) ? "Yes" : "No"}</p><p>Focus keyword in description: {description.toLowerCase().includes(focusKeyword) ? "Yes" : "No"}</p></>}</div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
