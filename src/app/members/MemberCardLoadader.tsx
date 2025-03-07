"use client";

import { Card } from '@heroui/react';

export default function MemberCardLoader() {
  return (
        <Card fullWidth>
          <div className="aspect-square object-cover transition-transform w-full h-full bg-primary animate-pulse" />
        </Card>
  );
}
