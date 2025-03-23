'use client';

import { Spinner } from '@heroui/react';
import React from 'react'

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center mt-10">
      <Spinner size="lg" />
    </div>
  );
}
