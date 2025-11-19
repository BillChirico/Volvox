import { describe, it, beforeEach, mock } from "node:test";
import assert from "node:assert";

describe("View Tracking", () => {
  let mockSessionStorage: Record<string, string>;

  beforeEach(() => {
    mockSessionStorage = {};

    global.sessionStorage = {
      getItem: (key: string) => mockSessionStorage[key] || null,
      setItem: (key: string, value: string) => {
        mockSessionStorage[key] = value;
      },
      removeItem: (key: string) => {
        delete mockSessionStorage[key];
      },
      clear: () => {
        mockSessionStorage = {};
      },
      length: 0,
      key: () => null,
    } as Storage;
  });

  describe("getViewedPosts", () => {
    it("returns empty Set when no posts viewed", async () => {
      const { getViewedPosts } = await import("../src/lib/view-tracking.js");
      const result = getViewedPosts();
      assert.strictEqual(result.size, 0);
    });

    it("returns Set with stored slugs", async () => {
      mockSessionStorage["volvox_viewed_posts"] = JSON.stringify([
        "post-1",
        "post-2",
      ]);
      const { getViewedPosts } = await import("../src/lib/view-tracking.js");
      const result = getViewedPosts();
      assert.strictEqual(result.size, 2);
      assert.ok(result.has("post-1"));
      assert.ok(result.has("post-2"));
    });
  });

  describe("saveViewedPosts", () => {
    it("saves Set to sessionStorage as JSON array", async () => {
      const { saveViewedPosts } = await import("../src/lib/view-tracking.js");
      const posts = new Set(["post-1", "post-2"]);
      saveViewedPosts(posts);
      const stored = mockSessionStorage["volvox_viewed_posts"];
      assert.ok(stored);
      const parsed = JSON.parse(stored);
      assert.strictEqual(parsed.length, 2);
      assert.ok(parsed.includes("post-1"));
      assert.ok(parsed.includes("post-2"));
    });
  });
});
