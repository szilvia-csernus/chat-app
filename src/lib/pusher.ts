import PusherServer from "pusher";
import PusherClient from "pusher-js";

declare global {
  var pusherServerInstance: PusherServer | undefined;
  var pusherClientInstance: PusherClient | undefined;
}

if (!global.pusherServerInstance) {
  global.pusherServerInstance = new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
    secret: process.env.PUSHER_APP_SECRET!,
    cluster: "eu",
    useTLS: true,
  });
}

if (!global.pusherClientInstance) {
  global.pusherClientInstance = new PusherClient(
    process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
    {
      channelAuthorization: {
        endpoint: "/api/pusher-auth",
        transport: "ajax",
      },
      cluster: "eu",
    }
  );
}

export const pusherServer = global.pusherServerInstance;
export const pusherClient = global.pusherClientInstance;

// this code makes sure that hot-module-reload would not consistently create
// new instances so we only have one instance of the pusher client and server 
// in the application to avoid overcharge.
