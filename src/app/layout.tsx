import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import MainNav from "@/components/navbar/MainNav";
import { auth } from "@/auth";
import { getUserById } from "./actions/authActions";
import { getPhotoByUserId } from "./actions/photoActions";
import { User } from "@prisma/client";


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

  return (
    <html lang="en">
      <body className="font-body h-screen">
        <Providers>
          <MainNav user={user} photoUrl={photoUrl}/>
          <main className="container mx-auto p-10">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
