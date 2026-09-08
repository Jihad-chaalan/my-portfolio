"use client";

import { useEffect, useState } from "react";
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

  // Scroll-spy: highlight the nav link of the section currently in view.
  useEffect(() => {
    const sections = SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(String(entry.target.id));
          }
        }
      },
      // Trigger when a section crosses the middle band of the viewport.
      { rootMargin: "-45% 0px -45% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

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

  return (
    <header className="fixed inset-x-0 top-2 z-50 flex justify-center px-2 sm:px-4 lg:px-6">
      <div className="flex w-full flex-col overflow-hidden rounded-full bg-forest px-4 shadow-lg shadow-forest/30 sm:px-8">
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

          {/* Mobile menu toggle — far right on small screens */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="col-start-3 inline-flex h-11 w-11 items-center justify-center justify-self-end rounded-md text-canvas transition-colors hover:bg-canvas/10 md:hidden"
          >
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
          </button>
        </nav>

        {menuOpen ? (
          <div
            id="mobile-menu"
            className="mt-2 border-t border-orange/30 bg-forest md:hidden"
          >
            <ul className="flex flex-col gap-1 pb-1 pt-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={hrefFor(link.href)}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-md px-4 py-3 text-base font-medium text-canvas transition-colors hover:bg-canvas/10 hover:text-orange"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pb-3 pt-1">
                <ButtonLink
                  href={siteConfig.links.bookACall}
                  external
                  variant="highlight"
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
  );
}