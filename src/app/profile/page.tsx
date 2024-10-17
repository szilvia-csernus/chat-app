import { auth } from '@/auth';
import React from 'react'

export default async function ProfilePage() {
  const session = await auth();


  return (
    <div>
      <h1 className="font-semibold text-2xl">
        Profile Page
      </h1>
      <br />

      <h3 className="text-xl font-semicolon">User session data: </h3>
      {session ? (
        <div>
          <pre>{JSON.stringify(session, null, 2)}</pre>

          <br />
        </div>
      ) : (
        <div>
          <p>Not logged in</p>
        </div>
      )}
    </div>
  );
}
