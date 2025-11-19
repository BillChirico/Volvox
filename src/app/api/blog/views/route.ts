import { incrementPostViews } from "@/lib/blog";
import { reportError } from "@/lib/logger";
import { supabase } from "@/lib/supabase";
import { normalizeSlug, slugConstraints } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

/**
 * API handler for recording blog post views.
 */
export async function POST(request: NextRequest) {
  try {
    let payload: unknown;

    try {
      payload = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 },
      );
    }

    const validatedSlug = normalizeSlug(
      typeof payload === "object" && payload !== null
        ? (payload as { slug?: unknown }).slug
        : undefined,
    );

    if (!validatedSlug) {
      return NextResponse.json(
        {
          error: `Invalid slug. Slugs must match ${slugConstraints.pattern} and be ≤ ${slugConstraints.maxLength} characters.`,
        },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("slug", validatedSlug)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 },
      );
    }

    await incrementPostViews(validatedSlug);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    reportError("Error incrementing post views", error);
    return NextResponse.json(
      { error: "Failed to increment views" },
      { status: 500 },
    );
  }
}
