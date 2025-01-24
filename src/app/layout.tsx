import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import MainNav from "@/components/navbar/MainNav";
import { auth } from "@/auth";
import { getUserById } from "./actions/authActions";
import { getPhotoByUserId } from "./actions/photoActions";
import { User } from "@prisma/client";
import { getChatPartners, getRecentChats } from "./actions/chatActions";
import { getCurrentProfileId } from "@/app/actions/profileActions";
import { mapCPDataToChatPartnerType, mapRCDataToRecentChatsType } from "@/lib/utils";

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
  const session = await auth();
  let user: User | null = null;
  let userPhoto = null;

  if (session && session.user && session.user.id) {
    user = await getUserById(session.user.id as string);
    if (user) {
      userPhoto = await getPhotoByUserId(user.id);
    }
  }
  const photoUrl = userPhoto ? userPhoto.imageUrl : "/images/user.png";

  const currentProfileId = await getCurrentProfileId();

  const chatPartnersData = await getChatPartners();
  
  const chatPartners = mapCPDataToChatPartnerType(currentProfileId, chatPartnersData);

  const recentChatsData = await getRecentChats();
  const recentChats = mapRCDataToRecentChatsType(recentChatsData);

  return (
    <html lang="en">
      <body className="font-body h-screen">
        <Providers
          userId={session?.user?.id}
          recentChats={recentChats}
          chatPartners={chatPartners}
        >
          <MainNav user={user} photoUrl={photoUrl} />
          <main className="container mx-auto p-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
