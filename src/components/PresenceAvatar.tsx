import { Avatar, Badge } from '@nextui-org/react';
import React from 'react'

type Props = {
  src?: string;
  online: boolean;
  className?: string;
}

export default function PresenceAvatar({ src, online, className="" }: Props) {
  return (
    <Badge content="" color="success" shape='circle' placement='bottom-right' isInvisible={!online}>
      <Avatar src={src || '/images/user.png'} alt="User avatar" className={className}/>
    </Badge>
  )
}
