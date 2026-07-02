"use client";

import { useState } from "react";
import {
  adminInput,
  adminLabel,
  adminButton,
  adminHeading,
  adminMessage,
} from "@/lib/admin-styles";

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
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className={adminHeading}>Add project</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={adminLabel}>Title</label>
          <input type="text" name="title" required className={adminInput} />
        </div>
        <div className="sm:col-span-2">
          <label className={adminLabel}>Description</label>
          <textarea name="description" required rows={3} className={adminInput} />
        </div>
        <div className="sm:col-span-2">
          <label className={adminLabel}>Tech stack (comma-separated)</label>
          <input
            type="text"
            name="techStack"
            placeholder="React, TypeScript, Node.js"
            required
            className={adminInput}
          />
        </div>
        <div>
          <label className={adminLabel}>GitHub URL</label>
          <input type="url" name="githubUrl" className={adminInput} />
        </div>
        <div>
          <label className={adminLabel}>Live URL</label>
          <input type="url" name="liveUrl" className={adminInput} />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="featured" id="featured" />
          <label
            htmlFor="featured"
            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-secondary"
          >
            Featured project
          </label>
        </div>
      </div>
      <button type="submit" disabled={loading} className={adminButton}>
        {loading ? "Saving..." : "Add project"}
      </button>
      {message && <p className={adminMessage}>{message}</p>}
    </form>
  );
}
