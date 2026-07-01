"use client";

import { useState } from "react";

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-text-primary">New Blog Post</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-text-secondary">Title</label>
          <input
            type="text"
            name="title"
            required
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-text-secondary">
            Slug (optional — defaults from title)
          </label>
          <input
            type="text"
            name="slug"
            placeholder="my-first-post"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-text-secondary">Excerpt</label>
          <textarea
            name="excerpt"
            required
            rows={2}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-text-secondary">
            Content (Markdown / MDX)
          </label>
          <textarea
            name="content"
            required
            rows={10}
            placeholder="# Heading&#10;&#10;Write your post in Markdown..."
            className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-text-primary"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-text-secondary">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            name="tags"
            placeholder="personal, code"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="published" id="published" defaultChecked />
          <label htmlFor="published" className="text-sm text-text-secondary">
            Published
          </label>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity duration-150 hover:opacity-70 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Post"}
      </button>
      {message && <p className="text-sm text-text-secondary">{message}</p>}
    </form>
  );
}
