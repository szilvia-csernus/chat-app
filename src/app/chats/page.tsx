import React from 'react'
import { authWithRedirect } from '../actions/authActions';
import { getLastChatId } from '../actions/chatActions';
import { redirect } from 'next/navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default async function ChatsPage() {
  await authWithRedirect();

  const lastActiveChat = await getLastChatId();

  if (!lastActiveChat) {
    return (
      <div className="h-full min-h-[calc(100dvh-80px)] flex flex-col justify-stretch">
        <div className="flex-grow w-full md:my-2 p-12 text-center text-slate-600 dark:text-slate-300 md:border-1 border-slate-300 dark:border-slate-500 bg-zig-zag flex flex-col gap-7 items-center">
          <h1 className="font-bold text-xl mb-2">No chats to show</h1>

          <p className="text-lg ">
            Why don't you head over to the Members page and find someone to chat
            with?
          </p>
          <Link
            href="/members"
            className="text-2xl text-[#fb9f3c] dark:text-accent underline font-bold"
          >
            Members
          </Link>
        </div>
        <Footer />
      </div>
    );
  }
  
  redirect(`/chats/${lastActiveChat}`);
}
