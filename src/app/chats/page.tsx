import React from 'react'
import { authWithRedirect } from '../actions/authActions';
import { getLastChatId } from '../actions/chatActions';
import { redirect } from 'next/navigation';

export default async function ChatsPage() {
  await authWithRedirect();

  const lastActiveChat = await getLastChatId();

  if (!lastActiveChat) {
    return <div>ChatsPage</div>;
  }
  
  redirect(`/chats/${lastActiveChat}`);
}
