import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import MainNav from "@/components/navbar/MainNav";
import { getCurrentUser } from "./actions/authActions";
import { getPhotoByUserId } from "./actions/photoActions";
import { getChatPartners, getRecentChats } from "./actions/chatActions";
import { getCurrentProfileId } from "@/app/actions/profileActions";

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

  const currentProfileId = await getCurrentProfileId();

  const chatPartners = await getChatPartners() || [];
  
  const recentChats = await getRecentChats() || [];


  return (
    <html lang="en" className="h-full overflow-scroll scrollbar-hide">
      <body className="font-body h-full">
        <Providers recentChats={recentChats} chatPartners={chatPartners}>
          <MainNav
            currentProfileId={currentProfileId}
            userName={userName}
            photoUrl={photoUrl}
          />
          <main className="container mx-auto px-2">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
