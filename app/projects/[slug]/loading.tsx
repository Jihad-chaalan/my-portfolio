export default function ProjectLoading() {
  return (
    <main id="main-content" aria-busy="true" aria-label="Loading project">
      <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-28 sm:px-6 sm:pb-20 sm:pt-36 lg:px-8">
        <div className="h-4 w-28 animate-pulse rounded bg-forest/15" />
        <div className="mt-8 h-16 w-4/5 animate-pulse rounded bg-forest/15 sm:h-24" />
        <div className="mt-5 h-5 w-full max-w-2xl animate-pulse rounded bg-forest/10" />
        <div className="mt-12 aspect-[16/9] w-full max-w-4xl animate-pulse bg-forest/10" />
      </div>
    </main>
  );
}
