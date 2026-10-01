import Image from "next/image";

// Real photos only, each with the caption it already carries elsewhere on the
// site. Same treatment as every other photo: rounded, contrast-[1.04], italic
// serif caption. Swipes sideways on phones instead of stacking three tall
// images.
const photos = [
  {
    src: "/jose-gym.jpg",
    alt: "Jose at the gym",
    width: 800,
    height: 1000,
    caption:
      "The one I love. On and off this fall, so I've been filling the gaps with salsa and bachata.",
  },
  {
    src: "/jose-lawn.jpg",
    alt: "Jose on the Lawn at UVA",
    width: 800,
    height: 1000,
    caption: "On the Lawn at UVA. Fourth year, class of 2027.",
  },
  {
    src: "/jose-coding.jpg",
    alt: "Jose coding at a cafe",
    width: 1200,
    height: 900,
    caption: "Natural habitat.",
  },
];

export default function PhotoStrip() {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-16">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">
          Lately, in photos
        </h2>
        <a
          href="https://instagram.com/hejoric"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-text-secondary transition-opacity duration-150 hover:opacity-70"
        >
          Instagram &#8599;
        </a>
      </div>
      <div className="-mr-6 mt-5 grid snap-x snap-mandatory auto-cols-[78%] grid-flow-col gap-4 overflow-x-auto pb-2 pr-6 sm:mr-0 sm:grid-flow-row sm:grid-cols-[1.1fr_1fr_1.25fr] sm:overflow-visible sm:pb-0 sm:pr-0">
        {photos.map((photo) => (
          <figure key={photo.src} className="snap-start">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(min-width: 640px) 340px, 78vw"
              className="h-[340px] w-full rounded object-cover contrast-[1.04] sm:h-[300px]"
            />
            <figcaption className="mt-2.5 font-display text-[14px] italic leading-snug text-text-muted">
              {photo.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
