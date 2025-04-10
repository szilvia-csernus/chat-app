'use client';

import { Spinner } from '@heroui/react';
import React from 'react'
import Footer from './Footer';

export default function LoadingSpinner() {
  return (
    <>
      <div className="h-[calc(100dvh-160px)] w-full flex items-center justify-center bg-zig-zag">
        <Spinner size="lg" variant="spinner" />
      </div>
      <Footer />
    </>
  );
}
