import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, isAdmin } from "@/lib/auth";
import { SignInButton, SignOutButton } from "@/components/AuthButton";
import AdminActivityForm from "@/components/AdminActivityForm";
import AdminProjectForm from "@/components/AdminProjectForm";
import AdminBlogForm from "@/components/AdminBlogForm";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await auth();

  // Nobody but the allowlisted admin can hold a session (see the signIn
  // callback in lib/auth.ts), so an unknown visitor just gets the login.
  if (!session?.user) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-5xl tracking-[-0.01em] text-text-primary sm:text-[56px] sm:leading-none">
          Admin.
        </h1>
        <p className="mt-4 max-w-[420px] leading-[1.7] text-text-secondary">
          Private. One account can sign in here.
        </p>
        <div className="mt-7">
          <SignInButton />
        </div>
      </div>
    );
  }

  if (!isAdmin(session.user.email)) redirect("/");

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-5xl tracking-[-0.01em] text-text-primary sm:text-[56px] sm:leading-none">
        Admin.
      </h1>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
          Signed in as {session.user.email}
        </p>
        <SignOutButton />
      </div>

      <div className="mt-10 space-y-6">
        <div className="rounded-md border border-border p-8">
          <AdminActivityForm />
        </div>

        <div className="rounded-md border border-border p-8">
          <AdminProjectForm />
        </div>

        <div className="rounded-md border border-border p-8">
          <AdminBlogForm />
        </div>
      </div>
    </div>
  );
}
