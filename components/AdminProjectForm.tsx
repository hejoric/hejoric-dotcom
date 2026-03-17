"use client";

import { useState } from "react";

export default function AdminProjectForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const form = new FormData(e.currentTarget);
    const body = {
      title: form.get("title"),
      description: form.get("description"),
      techStack: (form.get("techStack") as string)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      githubUrl: form.get("githubUrl") || null,
      liveUrl: form.get("liveUrl") || null,
      featured: form.get("featured") === "on",
    };

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setMessage("Project added!");
      (e.target as HTMLFormElement).reset();
    } else {
      const data = await res.json();
      setMessage(data.error || "Failed to add project.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-text-primary">Add Project</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-text-secondary">Title</label>
          <input
            type="text"
            name="title"
            required
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-text-secondary">Description</label>
          <textarea
            name="description"
            required
            rows={3}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-text-secondary">
            Tech Stack (comma-separated)
          </label>
          <input
            type="text"
            name="techStack"
            placeholder="React, TypeScript, Node.js"
            required
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-text-secondary">GitHub URL</label>
          <input
            type="url"
            name="githubUrl"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-text-secondary">Live URL</label>
          <input
            type="url"
            name="liveUrl"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="featured" id="featured" />
          <label htmlFor="featured" className="text-sm text-text-secondary">
            Featured project
          </label>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity duration-150 hover:opacity-70 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Add Project"}
      </button>
      {message && <p className="text-sm text-text-secondary">{message}</p>}
    </form>
  );
}
