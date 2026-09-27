import Image from "next/image";
import { EMAIL, followLinks } from "@/lib/links";

const greetings = ["Hola,", "What's up,", "こんにちは,", "안녕하세요,", "Hola,"];

export default function HeroSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-2 pt-10 sm:pt-16 lg:pt-20">
      {/* Two columns only at lg: below that the headline needs the full
          measure, so the photo turns into an avatar above the copy. */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_250px] lg:items-start lg:gap-12">
        <div>
          <h1 className="font-display text-[44px] leading-[1.06] tracking-[-0.01em] text-text-primary sm:text-5xl lg:text-[64px]">
            {/* The slots are taller than the clip so the serif's tall
                ascenders from the next greeting never peek into view. */}
            <span className="block h-[1.2em] overflow-hidden italic text-language" aria-hidden>
              <span className="animate-greeting flex flex-col items-start">
                {greetings.map((g, i) => (
                  <span key={i} className="block h-[1.4em] leading-[1.1]">
                    {g}
                  </span>
                ))}
              </span>
            </span>
            I&apos;m Hejoric.
          </h1>
          <p className="mt-6 max-w-[600px] text-base leading-[1.72] text-text-secondary sm:text-[17px]">
            Jose Ricardo Herrera, fourth year CS at UVA. This is my home on the
            web: what I&apos;m building, what I&apos;m learning on guitar and
            piano, the Korean and Japanese I&apos;m studying, the gym, and the
            stuff in between. All of it in one place, and everything on the
            graph below actually happened.{" "}
            <a
              href={`mailto:${EMAIL}`}
              className="border-b border-text-muted text-text-primary transition-opacity duration-150 hover:opacity-70"
            >
              Say hi
            </a>{" "}
            if you want to talk about any of it!
          </p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Follow along">
            {followLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center gap-2 rounded-full border border-border px-3.5 text-[13px] font-medium text-text-primary transition-colors duration-150 hover:border-text-muted"
                >
                  <span
                    className="h-[7px] w-[7px] rounded-[2px]"
                    style={{ backgroundColor: `var(${link.colorVar})` }}
                    aria-hidden
                  />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <figure className="order-first flex items-center gap-4 lg:order-none lg:mt-1.5 lg:block">
          <Image
            src="/jose-lawn.jpg"
            alt="Jose on the Lawn at UVA"
            width={800}
            height={1000}
            sizes="(min-width: 1024px) 250px, 88px"
            className="h-[72px] w-[72px] flex-none rounded-full object-cover object-[50%_28%] contrast-[1.04] sm:h-[88px] sm:w-[88px] lg:h-[312px] lg:w-full lg:rounded lg:object-center"
            priority
          />
          <figcaption className="font-display text-[14.5px] italic leading-snug text-text-muted lg:mt-3.5">
            On the Lawn at UVA. Fourth year, class of 2027.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
