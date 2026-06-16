import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cronType = searchParams.get("cron");
    const { origin } = new URL(request.url);

    // Forward headers (such as x-vercel-cron)
    const headers = new Headers();
    const vercelCronHeader = request.headers.get("x-vercel-cron");
    if (vercelCronHeader) {
      headers.set("x-vercel-cron", vercelCronHeader);
    }

    if (cronType === "9am") {
      // Delegate to the briefing endpoint
      const res = await fetch(`${origin}/api/alerts/briefing?${searchParams.toString()}`, {
        headers,
        cache: "no-store",
      });
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    } else {
      // Delegate to the milestones endpoint
      const res = await fetch(`${origin}/api/alerts/milestones?${searchParams.toString()}`, {
        headers,
        cache: "no-store",
      });
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }
  } catch (err: any) {
    console.error("Alerts proxy error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
