import { signIn, signOut } from "@/lib/auth";

// Auth controls live on /admin only. The public nav has no sign-in button:
// this is a single-admin allowlist, so a visitor clicking it would only ever
// get a rejected login.

const quietButton =
  "text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted transition-opacity duration-150 hover:text-text-primary hover:opacity-70";

const solidButton =
  "rounded-md bg-text-primary px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-background transition-opacity duration-150 hover:opacity-80";

export function SignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/admin" });
      }}
    >
      <button type="submit" className={solidButton}>
        Sign in with Google
      </button>
    </form>
  );
}

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button type="submit" className={quietButton}>
        Sign out
      </button>
    </form>
  );
}
