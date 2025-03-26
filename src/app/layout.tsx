import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import MainNav from "@/components/navbar/MainNav";
import { getCurrentUser } from "./actions/authActions";
import { getPhotoByUserId } from "./actions/photoActions";
import { getRecentChats } from "./actions/chatActions";
import { nunito } from "@/app/fonts";
import { getCurrentProfile } from "./actions/profileActions";
import { mapProfileDataToCurrentMember } from "@/lib/maps";
import Channels from "@/components/Channels";
import InitialStore from "@/components/InitialStore";
import { getMembers } from "./actions/memberActions";

export const metadata: Metadata = {
  title: "Chat App",
  description:
    "An app for chatting through the web. Built with Next.js, Prisma, Pusher, NextAuth and more.",
  // The openGraph property controls the appearance of the page when shared on social media.
  openGraph: {
    title: "Chat APP",
    description: "Start chatting today!",
    url: "https://szilvia-csernus.co.uk/chat-app",
    siteName: "ChatAPP",
    images: [
      {
        url: "https://szilvia-csernus.co.uk/chat-app/logo.png",
        width: 512,
        height: 512,
        alt: "Logo",
      },
    ],
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const userName = user?.name || null;

  let userPhoto = null;

  if (user) {
    userPhoto = await getPhotoByUserId(user.id);
  }

  const photoUrl = userPhoto ? userPhoto.imageUrl : "/images/user.png";

  const currentProfile = await getCurrentProfile();
  const currentMember =
    currentProfile && mapProfileDataToCurrentMember(currentProfile);
  const membersData = await getMembers();
  const recentChats = await getRecentChats();

  return (
    <html
      lang="en"
      className={`h-full overflow-y-scroll overflow-x-hidden scrollbar-hide`}
    >
      <body className="font-body h-full bg-background">
        <Providers>
          <InitialStore
            currentMember={currentMember}
            membersData={membersData}
            recentChats={recentChats}
          />
          <Channels />
          <MainNav
            currentMemberId={currentMember?.id || null}
            userName={userName}
            photoUrl={photoUrl}
          />
          <main
            className={`${nunito.className} h-full mx-auto w-full sm:max-w-4xl`}
          >
            <div className="place-items-center">{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
