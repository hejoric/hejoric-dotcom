import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminActivityForm from "@/components/AdminActivityForm";
import AdminProjectForm from "@/components/AdminProjectForm";

const ADMIN_EMAIL = "hejoric@outlook.com"; 

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
        Admin
      </h1>
      <p className="mt-2 text-text-secondary">
        Logged in as {session.user.email}
      </p>

      <div className="mt-10 space-y-12">
        <div className="rounded-lg border border-border p-6">
          <AdminActivityForm />
        </div>

        <div className="rounded-lg border border-border p-6">
          <AdminProjectForm />
        </div>

        <div className="rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-text-primary">
            New Blog Post
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Blog posts are created by adding an MDX file to{" "}
            <code className="rounded bg-surface px-1 py-0.5 text-xs">
              /content/blog/your-slug.mdx
            </code>{" "}
            and inserting metadata via the database. Use Prisma Studio or a
            direct DB insert for now.
          </p>
        </div>
      </div>
    </div>
  );
}
