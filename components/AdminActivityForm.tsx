"use client";

import { useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import {
  adminInput,
  adminLabel,
  adminButton,
  adminHeading,
  adminMessage,
} from "@/lib/admin-styles";

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
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className={adminHeading}>Log activity</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={adminLabel}>Date</label>
          <input
            type="date"
            name="date"
            required
            defaultValue={new Date().toISOString().split("T")[0]}
            className={adminInput}
          />
        </div>
        <div>
          <label className={adminLabel}>Category</label>
          <select name="category" required className={adminInput}>
            {CATEGORIES.map((cat) => (
              <option key={cat.key} value={cat.key}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={adminLabel}>Count</label>
          <input
            type="number"
            name="count"
            min="1"
            defaultValue="1"
            required
            className={adminInput}
          />
        </div>
        <div>
          <label className={adminLabel}>Note (optional)</label>
          <input type="text" name="note" className={adminInput} />
        </div>
      </div>
      <button type="submit" disabled={loading} className={adminButton}>
        {loading ? "Saving..." : "Log activity"}
      </button>
      {message && <p className={adminMessage}>{message}</p>}
    </form>
  );
}
