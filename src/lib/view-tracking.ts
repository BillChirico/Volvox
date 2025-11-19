const VIEWED_POSTS_KEY = "volvox_viewed_posts";

/**
 * Get the set of viewed post slugs from sessionStorage.
 */
export function getViewedPosts(): Set<string> {
  try {
    if (typeof sessionStorage === "undefined") return new Set();
    const stored = sessionStorage.getItem(VIEWED_POSTS_KEY);
    return new Set(stored ? JSON.parse(stored) : []);
  } catch {
    return new Set();
  }
}

/**
 * Save the set of viewed post slugs to sessionStorage.
 */
export function saveViewedPosts(posts: Set<string>): void {
  try {
    if (typeof sessionStorage === "undefined") return;
    sessionStorage.setItem(VIEWED_POSTS_KEY, JSON.stringify([...posts]));
  } catch (error) {
    console.error("Failed to save viewed posts:", error);
  }
}
