// Post request

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = req.headers.get("x-github-event");
   if (event === "ping") {
      return NextResponse.json({ message: "Pong" }, {status: 200});
    }
if (event === "pull_request") {
  // TODO: handle pull_request payload (body.action, body.pull_request, body.repository)
}


    return NextResponse.json({ message: "Event processed successfully" }, {status: 200});
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}