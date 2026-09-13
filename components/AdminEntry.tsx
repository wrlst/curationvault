"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { collections } from "@/lib/collections";
import { getSubcategoriesForCollection } from "@/lib/subcategories";

type Draft = { id: string; title: string; collection: string; subcategory: string };
type SaveResult = { ok?: boolean; error?: string; url?: string; published?: boolean; drafts?: Draft[] };

export default function AdminEntry() {
  const [mode, setMode] = useState<"checking" | "login" | "ready" | "unconfigured">("checking");
  const [collection, setCollection] = useState("architecture");
  const [subcategory, setSubcategory] = useState("residential");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [savedUrl, setSavedUrl] = useState("");
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    fetch("/api/admin/references", { cache: "no-store" })
      .then(async (response) => {
        if (response.ok) {
          const result = await response.json() as SaveResult;
          setDrafts(result.drafts || []);
          setMode("ready");
        } else setMode(response.status === 503 ? "unconfigured" : "login");
      })
      .catch(() => setMode("unconfigured"));
  }, []);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = event.currentTarget;
    const password = String(new FormData(form).get("password") || "");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ password }),
      });
      const result = await response.json() as SaveResult;
      if (!response.ok) throw new Error(result.error || "Could not sign in.");
      form.reset();
      setMode("ready");
      const draftsResponse = await fetch("/api/admin/references", { cache: "no-store" });
      if (draftsResponse.ok) setDrafts(((await draftsResponse.json()) as SaveResult).drafts || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setSavedUrl("");
    const form = event.currentTarget;
    const fields = new FormData(form);
    const data = Object.fromEntries(fields.entries());
    const payload = { ...data, collection, subcategory, published: fields.get("published") === "on" };
    try {
      const response = await fetch("/api/admin/references", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(payload),
      });
      const result = await response.json() as SaveResult;
      if (response.status === 401) setMode("login");
      if (!response.ok) throw new Error(result.error || "Could not save the reference.");
      setMessage(result.published ? "Published. The reference is now in its gallery." : "Draft saved. It is not visible in the public gallery.");
      setSavedUrl(result.published ? result.url || "" : "");
      form.reset();
      setCollection("architecture");
      setSubcategory("residential");
      if (!result.published) {
        const draftsResponse = await fetch("/api/admin/references", { cache: "no-store" });
        if (draftsResponse.ok) setDrafts(((await draftsResponse.json()) as SaveResult).drafts || []);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save the reference.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" });
    setMode("login");
    setMessage("");
  }

  async function publishDraft(draft: Draft) {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/references", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ id: draft.id }),
      });
      const result = await response.json() as SaveResult;
      if (!response.ok) throw new Error(result.error || "Could not publish draft.");
      setDrafts((current) => current.filter((item) => item.id !== draft.id));
      setMessage("Published. The reference is now in its gallery.");
      setSavedUrl(result.url || "");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not publish draft.");
    } finally {
      setBusy(false);
    }
  }

  const options = getSubcategoriesForCollection(collection);

  return (
    <section className="admin-page">
      <div className="section-label"><span>PRIVATE ARCHIVE</span><span>CONTENT ENTRY</span></div>
      <div className="admin-heading">
        <h1>Add to Vault</h1>
        {mode === "ready" && <button type="button" className="admin-quiet-button" onClick={signOut}>Sign out</button>}
      </div>
      {mode === "checking" && <p role="status">Checking access…</p>}
      {mode === "unconfigured" && <p role="status">Admin is not configured. Connect the D1 database and set the admin password in Cloudflare Pages.</p>}
      {mode === "login" && (
        <form className="admin-form admin-login" onSubmit={signIn}>
          <p>Sign in to add a reference.</p>
          <label>Password<input name="password" type="password" autoComplete="current-password" required minLength={16} /></label>
          <button type="submit" className="admin-submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
        </form>
      )}
      {mode === "ready" && (
        <form ref={formRef} className="admin-form" onSubmit={save}>
          <label className="admin-full">Title<input name="title" required maxLength={180} placeholder="The name of the piece" /></label>
          <div className="admin-form-grid">
            <label>Collection
              <select name="collection" value={collection} onChange={(event) => {
                const next = event.target.value;
                setCollection(next);
                setSubcategory(getSubcategoriesForCollection(next)[0]?.slug || "");
              }}>
                {collections.map((item) => <option key={item.slug} value={item.slug}>{item.title}</option>)}
              </select>
            </label>
            <label>Subcategory
              <select name="subcategory" value={subcategory} onChange={(event) => setSubcategory(event.target.value)}>
                {options.map((item) => <option key={item.slug} value={item.slug}>{item.title}</option>)}
              </select>
            </label>
          </div>
          <label className="admin-full">Image URL<input name="imageUrl" type="url" inputMode="url" placeholder="https://example.com/image.jpg" /></label>
          <div className="admin-form-grid">
            <label>Source URL<input name="sourceUrl" type="url" inputMode="url" placeholder="https://example.com/project" /></label>
            <label>Source label<input name="sourceLabel" placeholder="Original source" /></label>
          </div>
          <div className="admin-form-grid">
            <label>Creator name<input name="creatorName" placeholder="Name, if known" /></label>
            <label>Creator URL<input name="creatorUrl" type="url" inputMode="url" placeholder="https://example.com" /></label>
          </div>
          <div className="admin-form-grid">
            <label>Year<input name="year" placeholder="Year, if known" /></label>
            <label>Location<input name="location" placeholder="Place, if known" /></label>
          </div>
          <label className="admin-full">Description<textarea name="description" rows={5} placeholder="A short note, if useful" /></label>
          <label className="admin-published"><input name="published" type="checkbox" defaultChecked /> Publish immediately</label>
          <button type="submit" className="admin-submit" disabled={busy}>{busy ? "Saving…" : "Save reference ↗"}</button>
        </form>
      )}
      {mode === "ready" && drafts.length > 0 && (
        <section className="admin-drafts" aria-label="Unpublished drafts">
          <div className="section-label"><span>DRAFTS</span><span>{String(drafts.length).padStart(2, "0")}</span></div>
          {drafts.map((draft) => (
            <div className="admin-draft" key={draft.id}>
              <div><strong>{draft.title}</strong><span>{draft.collection} / {draft.subcategory}</span></div>
              <button type="button" disabled={busy} onClick={() => publishDraft(draft)}>Publish ↗</button>
            </div>
          ))}
        </section>
      )}
      {message && <p className="admin-message" role="status">{message}</p>}
      {savedUrl && <a className="text-link" href={savedUrl}>View reference ↗</a>}
    </section>
  );
}
