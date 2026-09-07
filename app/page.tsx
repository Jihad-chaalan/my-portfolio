export default function Home() {
  return (
    <main id="main-content">
      <section
        id="home"
        aria-label="Introduction"
        className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center"
      >
        <p className="font-brand text-3xl text-forest sm:text-4xl">
          Jihad Chaalan
        </p>
        <h1 className="mt-4 font-display text-4xl uppercase leading-tight text-forest sm:text-6xl">
          Full-Stack AI Engineer
        </h1>
        <p className="mt-6 max-w-2xl text-base text-forest/80 sm:text-lg">
          Homepage sections (Hero, Skills, Projects, Contact) are implemented
          task by task. This is the Task 1 foundation checkpoint.
        </p>
      </section>
    </main>
  );
}

