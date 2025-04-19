import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import { updateProfileLastActive } from "@/app/actions/profileActions";

export async function POST(request: Request) {
  try {
    // Verify the webhook signature
    const webhookSignature = request.headers.get("x-pusher-signature");
    const body = await request.text(); // Read the raw body as text
    const webhook = pusherServer.webhook({
      rawBody: body,
      headers: { "x-pusher-signature": webhookSignature || "" },
    });

    const isValidSignature = webhook.isValid;

    if (!isValidSignature) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Parse the webhook payload
    const webhookPayload = JSON.parse(body);

    // Handle specific webhook events
    for (const event of webhookPayload.events) {
      if (event.name === "member_removed") {
        const userId = event.user_id; // The ID of the user who went inactive
        console.log(`User ${userId} went inactive.`);

        // Update the user's last active time in the database
        await updateProfileLastActive(userId);
      }
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Error handling Pusher webhook:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
