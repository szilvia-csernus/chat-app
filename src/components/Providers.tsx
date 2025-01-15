"use client"

import { usePresenceChannel } from '@/hooks/usePresenceChannel';
import { NextUIProvider } from '@nextui-org/react'
import React, { ReactNode } from 'react'
import { ToastContainer} from 'react-toastify'
import "react-toastify/ReactToastify.min.css";

type ProvidersProps = {
  children: ReactNode;
  userId: string;
};

export default function Providers({children, userId}: ProvidersProps) {
  usePresenceChannel(userId);

  return (
    <NextUIProvider>
      <ToastContainer position='bottom-right' hideProgressBar className='z-4' />
      {children}
    </NextUIProvider>
  )
}
