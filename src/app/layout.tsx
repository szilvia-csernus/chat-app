import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import MainNav from "@/components/navbar/MainNav";
import { auth } from "@/auth";
import { getUserById } from "./actions/authActions";
import { getPhotoByUserId } from "./actions/photoActions";
import { User } from "@prisma/client";
import { getChatPartners, getRecentChats } from "./actions/chatActions";
import { getCurrentProfile } from "./actions/memberActions";

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

  const currentProfile = await getCurrentProfile();

  const chatPartnersData = await getChatPartners();
  const chatPartners = (chatPartnersData || []).map((cp) => {
    if (cp.profile1.id === currentProfile?.id) {
      return {
        chatId: cp.id,
        chatPartner: {
          id: cp.profile2.id,
          name: cp.profile2.user.name || "",
          image: cp.profile2.user.image || "",
        },
      };
    } else {
      return {
        chatId: cp.id,
        chatPartner: {
          id: cp.profile1.id,
          name: cp.profile1.user.name || "",
          image: cp.profile1.user.image || "",
        },
      };
    }
  });

  const recentChatsData = await getRecentChats();
  const recentChats = (recentChatsData || []).map((chat) => {
    return {
      id: chat.id,
      participant1: {
        id: chat.profile1.id,
        name: chat.profile1.user.name || "",
        image: chat.profile1.user.image || "",
      },
      participant2: {
        id: chat.profile2.id,
        name: chat.profile2.user.name || "",
        image: chat.profile2.user.image || "",
      },
      lastMessage: chat.messages[0]?.content || "",
      unreadMessages: chat._count.messages,
    };
  });

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
