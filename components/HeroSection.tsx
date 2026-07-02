const greetings = ["Hola —", "Hello —", "こんにちは —", "안녕하세요 —", "Hola —"];

export default function HeroSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-6 pt-16 sm:pt-20">
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
        I&apos;m Jose. I build things,
        <br />
        and I keep track of them.
      </h1>
      <p className="mt-7 max-w-[600px] text-[16.5px] leading-[1.75] text-text-secondary">
        Code, workouts, the Korean I&apos;m slowly wrestling into my brain,
        whatever&apos;s on repeat, the stuff I make. Basically a contribution
        graph for a whole life.{" "}
        <span className="font-display text-lg italic text-text-primary">
          Poke around.
        </span>
      </p>
    </section>
  );
}
