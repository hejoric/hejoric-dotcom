import { redirect } from "next/navigation";
import { auth, isAdmin } from "@/lib/auth";
import AdminActivityForm from "@/components/AdminActivityForm";
import AdminProjectForm from "@/components/AdminProjectForm";
import AdminBlogForm from "@/components/AdminBlogForm";

export default async function AdminPage() {
  const session = await auth();

  if (!isAdmin(session?.user?.email)) {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-5xl tracking-[-0.01em] text-text-primary sm:text-[56px] sm:leading-none">
        Admin.
      </h1>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
        Signed in as {session?.user?.email}
      </p>

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
