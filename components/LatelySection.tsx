/* eslint-disable @next/next/no-img-element */

interface LatelyItem {
  kind: string;
  title: string;
  subtitle: string | null;
  url: string | null;
  imageUrl: string | null;
}

const KINDS: Record<
  string,
  { label: string; colorClass: string; thumbClass: string; placeholder: string }
> = {
  video: {
    label: "Last Upload",
    colorClass: "text-reading",
    thumbClass: "h-[66px] w-[118px]",
    placeholder: "thumbnail",
  },
  song: {
    label: "On Repeat",
    colorClass: "text-music",
    thumbClass: "h-[66px] w-[66px]",
    placeholder: "art",
  },
  book: {
    label: "Currently Reading",
    colorClass: "text-reading",
    thumbClass: "h-[94px] w-[66px]",
    placeholder: "cover",
  },
};

const ORDER = ["video", "song", "book"];

function Thumb({ item, kind }: { item: LatelyItem; kind: (typeof KINDS)[string] }) {
  if (item.imageUrl) {
    return (
      <img
        src={item.imageUrl}
        alt=""
        className={`${kind.thumbClass} flex-none rounded-[3px] object-cover`}
      />
    );
  }
  return (
    <span
      className={`${kind.thumbClass} flex flex-none items-center justify-center rounded-[3px] font-mono text-[10px] text-text-muted`}
      style={{
        background:
          "repeating-linear-gradient(45deg, var(--surface) 0 8px, var(--background) 8px 16px)",
      }}
    >
      {kind.placeholder}
    </span>
  );
}

export default function LatelySection({ items }: { items: LatelyItem[] }) {
  const sorted = ORDER.map((k) => items.find((i) => i.kind === k)).filter(
    (i): i is LatelyItem => Boolean(i)
  );

  if (sorted.length === 0) return null;

  return (
    <section className="mx-auto max-w-5xl px-6 pt-14">
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">
        Lately
      </span>
      <div className="mt-5 grid gap-9 sm:grid-cols-3 sm:gap-10">
        {sorted.map((item) => {
          const kind = KINDS[item.kind];
          const content = (
            <>
              <span
                className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${kind.colorClass}`}
              >
                {kind.label}
              </span>
              <div className="mt-3 flex items-start gap-3.5">
                <Thumb item={item} kind={kind} />
                <div>
                  <div className="font-display text-lg italic leading-[1.3] text-text-primary">
                    {item.title}
                  </div>
                  {item.subtitle && (
                    <div className="mt-1.5 text-xs text-text-muted">
                      {item.subtitle}
                    </div>
                  )}
                </div>
              </div>
            </>
          );

          if (item.url) {
            return (
              <a
                key={item.kind}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-opacity duration-150 hover:opacity-70"
              >
                {content}
              </a>
            );
          }
          return <div key={item.kind}>{content}</div>;
        })}
      </div>
    </section>
  );
}
