"use client";

import { Card } from '@heroui/react';

export default function Loader() {
  return (
    <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-8">
      {Array.from([1, 2, 3]).map((el) => (
        <Card key={el} fullWidth>
          <div className="aspect-square object-cover transition-transform w-full h-full bg-primary animate-pulse" />
        </Card>
      ))}
    </div>
  );
}
