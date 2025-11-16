import PusherServer from "pusher";
import PusherClient from "pusher-js";

type PusherGlobal = typeof globalThis & {
  pusherServerInstance?: PusherServer;
  pusherClientInstance?: PusherClient;
};

const globalForPusher = globalThis as PusherGlobal;

if (!globalForPusher.pusherServerInstance) {
  globalForPusher.pusherServerInstance = new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
    secret: process.env.PUSHER_APP_SECRET!,
    cluster: "eu",
    useTLS: true,
  });
}

if (!globalForPusher.pusherClientInstance) {
  globalForPusher.pusherClientInstance = new PusherClient(
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

export const pusherServer = globalForPusher.pusherServerInstance;
export const pusherClient = globalForPusher.pusherClientInstance;

// this code makes sure that during development, hot-module-reload would not repeatedly create
// new instances. This way, we can avoid overcharge by having only one instance for
// the pusher client as well as for the pusher server.
