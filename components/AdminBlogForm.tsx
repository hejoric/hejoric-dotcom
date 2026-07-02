"use client";

import { useState } from "react";
import {
  adminInput,
  adminLabel,
  adminButton,
  adminHeading,
  adminMessage,
} from "@/lib/admin-styles";

export default function AdminBlogForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const form = new FormData(e.currentTarget);
    const body = {
      title: form.get("title"),
      slug: (form.get("slug") as string) || form.get("title"),
      excerpt: form.get("excerpt"),
      content: form.get("content"),
      tags: (form.get("tags") as string)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      published: form.get("published") === "on",
    };

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setMessage("Post saved!");
      (e.target as HTMLFormElement).reset();
    } else {
      const data = await res.json();
      setMessage(data.error || "Failed to save post.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className={adminHeading}>New blog post</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={adminLabel}>Title</label>
          <input type="text" name="title" required className={adminInput} />
        </div>
        <div>
          <label className={adminLabel}>Slug (optional — defaults from title)</label>
          <input
            type="text"
            name="slug"
            placeholder="my-first-post"
            className={adminInput}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={adminLabel}>Excerpt</label>
          <textarea name="excerpt" required rows={2} className={adminInput} />
        </div>
        <div className="sm:col-span-2">
          <label className={adminLabel}>Content (Markdown / MDX)</label>
          <textarea
            name="content"
            required
            rows={10}
            placeholder="# Heading&#10;&#10;Write your post in Markdown..."
            className={`${adminInput} font-mono`}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={adminLabel}>Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            placeholder="personal, code"
            className={adminInput}
          />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="published" id="published" defaultChecked />
          <label
            htmlFor="published"
            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-secondary"
          >
            Published
          </label>
        </div>
      </div>
      <button type="submit" disabled={loading} className={adminButton}>
        {loading ? "Saving..." : "Save post"}
      </button>
      {message && <p className={adminMessage}>{message}</p>}
    </form>
  );
}
