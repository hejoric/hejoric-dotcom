import Image from "next/image";

const greetings = ["Hola,", "What's up,", "こんにちは,", "안녕하세요,", "Hola,"];

export default function HeroSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-6 pt-16 sm:pt-20">
      {/* Two columns only at lg: below that the headline needs the full
          measure, so the photo stacks under the copy instead. */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start lg:gap-12">
        <div>
          <h1 className="font-display text-4xl leading-[1.08] tracking-[-0.01em] text-text-primary sm:text-5xl lg:text-[64px]">
            <span className="inline-flex h-[1.08em] items-start overflow-hidden align-bottom italic text-language">
              <span className="animate-greeting flex flex-col items-start">
                {greetings.map((g, i) => (
                  <span key={i} className="block h-[1.08em]">
                    {g}
                  </span>
                ))}
              </span>
            </span>
            <br />
            I&apos;m Hejoric, aka The
            <br />
            Jose Ricardo Herrera.
          </h1>
          <p className="mt-7 max-w-[620px] text-[16.5px] leading-[1.75] text-text-secondary">
            CS at UVA. I build usable niche tools for people with weirdly
            specific problems, and this site is where you can check in on all
            of it: the software, the pieces I&apos;m learning, the languages
            I&apos;m studying, the gym. Everything on the graph below actually
            happened.{" "}
            <span className="font-display text-lg italic text-text-primary">
              Say hi if you want to talk about any of it!
            </span>
          </p>
        </div>
        <figure className="w-[200px] sm:w-[240px] lg:mt-1.5">
          <Image
            src="/jose-gym.jpg"
            alt="Jose at the gym"
            width={800}
            height={1000}
            className="h-[250px] w-full rounded object-cover contrast-[1.04] sm:h-[300px]"
            priority
          />
          <figcaption className="mt-3.5 font-display text-[14.5px] italic text-text-muted">
            The one I love. On and off this fall, so I&apos;ve been filling
            the gaps with salsa and bachata.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
