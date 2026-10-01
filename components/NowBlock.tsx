// What I'm up to lately. Hand-written on purpose: it changes a few times a
// semester, and a stale line here is easier to spot than a stale DB row.
const now =
  "Getting the retail ERP ready for its production cutover this fall, Korean 101 and chapter 1 of Integrated Korean, learning Snow by RHCP, and working on getting the gym back to consistent.";

export default function NowBlock() {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-12">
      <div className="grid gap-2 border-y border-border py-6 sm:grid-cols-[100px_minmax(0,1fr)] sm:gap-6">
        <h2 className="pt-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">
          Now
        </h2>
        <p className="max-w-[760px] font-display text-[21px] italic leading-[1.45] text-text-primary sm:text-2xl">
          {now}
        </p>
      </div>
    </section>
  );
}
