import React from 'react'
import { GoDot, GoDotFill } from 'react-icons/go'

type PresenceDotProps = {
  outlineColor?: string
}


export default function PresenceDot({ outlineColor="primary" }: PresenceDotProps) {

  return (
    <div className="relative">
      <GoDot size={28} fill={outlineColor} className="absolute left-[-3px] top-0"/>
      <GoDotFill
        size={22}
        className="fill-teal-400 animate-pulse absolute top-[3px] left-0"
      />
    </div>
  );
}
