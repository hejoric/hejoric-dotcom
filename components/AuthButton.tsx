import Link from "next/link";
import { auth, signIn, signOut, isAdmin } from "@/lib/auth";

const buttonClass =
  "rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text-primary transition-opacity duration-150 hover:opacity-70";

export default async function AuthButton() {
  const session = await auth();

  if (isAdmin(session?.user?.email)) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className="text-sm text-text-secondary transition-opacity duration-150 hover:text-text-primary hover:opacity-70"
        >
          Admin
        </Link>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button type="submit" className={buttonClass}>
            Sign out
          </button>
        </form>
      </div>
    );
  }

  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/admin" });
      }}
    >
      <button type="submit" className={buttonClass}>
        Sign in
      </button>
    </form>
  );
}
