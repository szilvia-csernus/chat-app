import React from 'react'
import { GoDot, GoDotFill } from 'react-icons/go'

type PresenceDotProps = {
  outlineColor?: string
}


export default function PresenceDot({ outlineColor="primary" }: PresenceDotProps) {

  return (
    <span>
      <GoDot size={26} className={`fill-${outlineColor} absolute left-[-3px] top-0`}/>
      <GoDotFill
        size={20}
        className="fill-teal-400 animate-pulse absolute top-[3px] left-0"
      />
    </span>
  );
}
