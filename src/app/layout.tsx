import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import MainNav from "@/components/navbar/MainNav";
import { getCurrentUser } from "./actions/authActions";
import { getPhotoByUserId } from "./actions/photoActions";
import {
  getChat,
  getChatPartners,
  getRecentChats,
} from "./actions/chatActions";
import {
  getCurrentProfile,
  getCurrentProfileId,
} from "@/app/actions/profileActions";

export const metadata: Metadata = {
  title: "Chat App",
  description:
    "An app for chatting through the web. Built with Next.js, Prisma, and NextAuth.",
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

  const chatPartners = (await getChatPartners()) || [];

  const recentChats = (await getRecentChats()) || [];

  const currentChat = currentProfile?.lastActiveConversationId
    ? await getChat(currentProfile.lastActiveConversationId)
    : null;

  return (
    <html lang="en" className="h-full overflow-scroll scrollbar-hide">
      <body className="font-body h-full">
        <Providers
          recentChats={recentChats}
          chatPartners={chatPartners}
          currentChat={currentChat}
        >
          <MainNav
            currentProfileId={currentProfile?.id || null}
            userName={userName}
            photoUrl={photoUrl}
          />
          <main className="container mx-auto px-2">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
