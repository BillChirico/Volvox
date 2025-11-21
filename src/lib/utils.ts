import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a URL-safe heading ID from text content.
 *
 * Converts text to lowercase, replaces spaces with hyphens, removes
 * non-alphanumeric characters (except hyphens and underscores), and
 * trims leading/trailing hyphens.
 *
 * @param text - The text content to convert to an ID
 * @returns A URL-safe ID string, or empty string if input is empty
 *
 * @example
 * generateHeadingId("Hello World!") // returns "hello-world"
 * generateHeadingId("API Reference") // returns "api-reference"
 * generateHeadingId("  Spaced  ") // returns "spaced"
 */
export function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "")
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}
