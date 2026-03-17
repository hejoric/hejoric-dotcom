"use client";

import { useState } from "react";

const categories = [
  { value: "code", label: "Code" },
  { value: "music", label: "Music" },
  { value: "language", label: "Languages" },
  { value: "fitness", label: "Fitness" },
  { value: "content", label: "Content" },
];

export default function AdminActivityForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const form = new FormData(e.currentTarget);
    const body = {
      date: form.get("date"),
      category: form.get("category"),
      count: Number(form.get("count")),
      note: form.get("note") || null,
    };

    const res = await fetch("/api/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setMessage("Activity logged!");
      (e.target as HTMLFormElement).reset();
    } else {
      const data = await res.json();
      setMessage(data.error || "Failed to log activity.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-text-primary">Log Activity</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-text-secondary">Date</label>
          <input
            type="date"
            name="date"
            required
            defaultValue={new Date().toISOString().split("T")[0]}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-text-secondary">Category</label>
          <select
            name="category"
            required
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm text-text-secondary">Count</label>
          <input
            type="number"
            name="count"
            min="1"
            defaultValue="1"
            required
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-text-secondary">Note (optional)</label>
          <input
            type="text"
            name="note"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity duration-150 hover:opacity-70 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Log Activity"}
      </button>
      {message && <p className="text-sm text-text-secondary">{message}</p>}
    </form>
  );
}
