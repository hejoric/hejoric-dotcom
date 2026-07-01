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
      <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
        Admin
      </h1>
      <p className="mt-2 text-text-secondary">
        Logged in as {session?.user?.email}
      </p>

      <div className="mt-10 space-y-12">
        <div className="rounded-lg border border-border p-6">
          <AdminActivityForm />
        </div>

        <div className="rounded-lg border border-border p-6">
          <AdminProjectForm />
        </div>

        <div className="rounded-lg border border-border p-6">
          <AdminBlogForm />
        </div>
      </div>
    </div>
  );
}
