import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import MainNav from "@/components/navbar/MainNav";
import { getCurrentUser } from "./actions/authActions";
import { getPhotoByUserId } from "./actions/photoActions";
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
  const user = await getCurrentUser();

  let userPhoto = null;

  if (user) {
    userPhoto = await getPhotoByUserId(user.id);
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
          currentProfileId={currentProfileId || null}
          recentChats={recentChats}
          chatPartners={chatPartners}
        >
          <MainNav userName={user.name} photoUrl={photoUrl} />
          <main className="container mx-auto p-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
