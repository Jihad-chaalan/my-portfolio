import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Queue a global `ScrollTrigger.refresh()` for when the document's fonts and
 * images finish settling — late layout shifts would otherwise leave trigger
 * positions measured at mount pointing at the wrong pixels.
 *
 * Skipped when nothing is still loading. On a client-side navigation the fonts
 * are already loaded and the `load` event has already fired, so `fonts.ready`
 * would resolve in the same tick the new route mounts — and a `refresh()` at
 * that moment is what made pages open mid-scroll: `refresh()` scrolls the page
 * to 0 to take measurements, then restores the position ScrollTrigger
 * remembered for the window scroller, a value that still belongs to the
 * *previous* page.
 *
 * Returns a cleanup that detaches the `load` listener. `isDisposed` cancels a
 * refresh that would otherwise fire after the calling component has unmounted
 * (a route change) — a global refresh must never outlive its owner.
 */
export function refreshWhenLayoutSettles(isDisposed: () => boolean): () => void {
  const refresh = () => {
    if (!isDisposed()) ScrollTrigger.refresh();
  };

  window.addEventListener("load", refresh);

  const fonts = document.fonts;
  if (fonts && fonts.status !== "loaded") {
    void fonts.ready.then(refresh);
  }

  return () => window.removeEventListener("load", refresh);
}
