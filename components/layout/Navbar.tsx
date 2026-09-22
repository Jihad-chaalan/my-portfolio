"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { navLinks, siteConfig } from "@/lib/site";
import { cn } from "@/lib/cn";

const SECTION_IDS = navLinks.map((link) => link.href.replace(/^#/, ""));

/**
 * The site's primary navigation — a floating rounded pill in forest green.
 * It is fixed near the top of the viewport (not full width), and at the top
 * of the page it reads as part of the green hero box below it.
 *
 * A Client Component because it needs interactive state (mobile menu,
 * scroll-spy highlighting).
 */
export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const hrefFor = (href: string) => (isHome ? href : `/${href}`);

  // Scroll-spy: highlight the nav link of the section currently in view, and
  // keep the URL hash in step with it.
  //
  // Syncing the hash is not cosmetic. If the URL keeps saying `#projects`
  // while you're actually in Contact, clicking "Projects" asks the browser to
  // jump to the hash it is *already on*, which is a no-op — nav links appear
  // dead until you click a different section first.
  //
  // `replaceState` is the right tool here: it updates the URL without adding
  // a history entry and without triggering a scroll of its own. Only the home
  // page has these sections, so the spy (and the hash syncing) is skipped
  // elsewhere.
  useEffect(() => {
    if (!isHome) return;

    const sections = SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (sections.length === 0) return;

    /** Id last written to the URL, and whether the initial callback has run. */
    let syncedId: string | null = null;
    let primed = false;

    const observer = new IntersectionObserver(
      (entries) => {
        // IntersectionObserver fires once on observe with the page's starting
        // state. That first callback must not touch the URL: rewriting it just
        // because the page loaded would mean a plain refresh lands mid-page
        // (and the hero intro would play over an already-scrolled page)
        // instead of at the top. From then on, only an actual change of
        // section syncs the hash.
        const isInitialCallback = !primed;
        primed = true;

        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const id = String(entry.target.id);
          setActiveSection(id);

          if (isInitialCallback || id === syncedId) {
            syncedId = id;
            continue;
          }
          syncedId = id;

          const hash = `#${id}`;
          if (window.location.hash !== hash) {
            window.history.replaceState(null, "", hash);
          }
        }
      },
      // Trigger when a section crosses the middle band of the viewport.
      { rootMargin: "-45% 0px -45% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isHome]);

  // Close the mobile menu on Escape or when the viewport grows to desktop.
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const closeOnResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", closeOnResize);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", closeOnResize);
    };
  }, []);

  /**
   * Jump to a homepage section and keep the URL hash truthful.
   *
   * Intercepting the click (rather than letting the browser handle it) is what
   * makes the nav reliable:
   *  - it scrolls even when the target hash already matches the URL, which a
   *    plain anchor navigation would treat as a no-op;
   *  - it re-scrolls when you're already inside that section, so clicking
   *    "Projects" from the bottom of Projects returns you to its top;
   *  - `scrollIntoView()` honours `scroll-margin-top` from `globals.css`, so
   *    the section still clears the fixed navbar pill, and it defers to the
   *    CSS `scroll-behavior: smooth` (already forced to `auto` under
   *    `prefers-reduced-motion`).
   *
   * `event.preventDefault()` also suppresses Next's own navigation here —
   * verified against the installed source, where `linkClicked` returns early
   * on `e.defaultPrevented` (`node_modules/next/dist/client/link.js`). On any
   * other route we return early instead, so `<Link>` performs the real
   * navigation back to the homepage section.
   */
  const handleSectionClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (!isHome) return;

    const id = href.replace(/^#/, "");
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView();

    // Mirror a normal in-page anchor click by pushing a history entry, except
    // when we're already on this hash (clicking the section you're in), where
    // a duplicate entry would be pointless.
    if (window.location.hash === href) {
      window.history.replaceState(null, "", href);
    } else {
      window.history.pushState(null, "", href);
    }

    setActiveSection(id);
  };

  return (
    <>
      {/* Fullscreen mobile overlay — covers the whole screen while the menu is
          open. Fixed sibling of the header (not inside the pill, which stays
          byte-identical), so the hero behind is fully dimmed instead of
          bleeding through. Clicking it closes the menu; it never takes focus. */}
      {menuOpen ? (
        <div
          aria-hidden="true"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-forest/60 backdrop-blur-sm md:hidden"
        />
      ) : null}
      <header
        data-intro="nav"
        className="fixed inset-x-0 top-2 z-50 flex justify-center px-2 sm:px-4 lg:px-6"
      >
        <div
          className={cn(
            "flex w-full flex-col overflow-hidden bg-forest px-4 shadow-lg shadow-forest/30 sm:px-8",
            menuOpen ? "rounded-3xl pb-3" : "rounded-full",
          )}
        >
        <nav
          aria-label="Primary"
          className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-3 sm:gap-6"
        >
          {/* Desktop links — centered */}
          <ul className="col-start-2 hidden items-center gap-12 md:flex lg:gap-20">
            {navLinks.map((link) => {
              const isActive = link.href.slice(1) === activeSection;
              return (
                <li key={link.href}>
                  <Link
                    href={hrefFor(link.href)}
                    onClick={(event) => handleSectionClick(event, link.href)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "text-base font-bold transition-colors lg:text-lg",
                      isActive ? "text-orange" : "text-surface hover:text-orange",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile "Book a Call" — far LEFT, small screens only. The same
              marker CTA as desktop, compact so the closed pill keeps its
              old size. Hidden once the fullscreen menu opens (the menu has
              its own full-width CTA), and the desktop pill from the next
              block takes over from md up. */}
          <div className="col-start-1 justify-self-start md:hidden">
            {menuOpen ? null : (
              <ButtonLink
                href={siteConfig.links.bookACall}
                external
                variant="highlight"
                compact
                className="text-sm"
              >
                Book a Call
              </ButtonLink>
            )}
          </div>

          {/* Book a Call — pinned to the far right, highlighter style */}
          <div className="hidden justify-self-end md:flex">
            <ButtonLink
              href={siteConfig.links.bookACall}
              external
              variant="highlight"
            >
              Book a Call
            </ButtonLink>
          </div>

          {/* Mobile menu toggle — far right on small screens.
              Swaps to an X while the menu is open (decorative <svg>s, so the
              accessible name stays on the button itself). */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="col-start-3 inline-flex h-11 w-11 items-center justify-center justify-self-end rounded-md text-canvas transition-colors hover:bg-canvas/10 md:hidden"
          >
            {menuOpen ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <line x1="4" y1="4" x2="16" y2="16" />
                <line x1="16" y1="4" x2="4" y2="16" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <line x1="3" y1="5" x2="17" y2="5" />
                <line x1="3" y1="10" x2="17" y2="10" />
                <line x1="3" y1="15" x2="17" y2="15" />
              </svg>
            )}
          </button>
        </nav>

        {menuOpen ? (
          /* Same pill, expanded: the menu lives INSIDE the container, so the
             closed pill keeps its exact shape and the open state is one solid
             card — `rounded-3xl + pb-3` breathing room keeps the bottom edge
             of the ring visible (no transition: the open state must appear
             instantly, not morph through a half-open middle shape). */
          <div
            id="mobile-menu"
            className="mt-2 rounded-2xl bg-forest p-2 ring-1 ring-canvas/25 md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = link.href.slice(1) === activeSection;
                return (
                  <li key={link.href}>
                    <Link
                      href={hrefFor(link.href)}
                      onClick={(event) => {
                        handleSectionClick(event, link.href);
                        setMenuOpen(false);
                      }}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl px-4 py-3 text-lg font-bold transition-colors hover:bg-canvas/10",
                        isActive ? "bg-canvas/10 text-orange" : "text-canvas",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "h-5 w-1 rounded-full",
                          isActive ? "bg-orange" : "bg-canvas/25",
                        )}
                      />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li className="px-1 pb-3 pt-2">
                <ButtonLink
                  href={siteConfig.links.bookACall}
                  external
                  variant="highlight"
                  compact
                  onClick={() => setMenuOpen(false)}
                  className="w-full"
                >
                  Book a Call
                </ButtonLink>
              </li>
            </ul>
          </div>
        ) : null}
        </div>
      </header>
    </>
  );
}