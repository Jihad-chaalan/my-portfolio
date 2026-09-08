/**
 * Tiny class-name joiner. Filters falsy values so conditional classes can
 * be passed as `false`/`undefined` without polluting the output.
 */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}