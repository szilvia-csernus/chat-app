import React from 'react'
import { authWithRedirect } from '../actions/authActions';

export default async function ChatsPage() {
  await authWithRedirect();
  return (
    <div>ChatsPage</div>
  )
}
