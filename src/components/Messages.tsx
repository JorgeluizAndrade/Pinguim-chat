"use client";

import { cn, toPusherKey } from "@/lib/utils";
import { Message } from "@/lib/validations/messages";
import { FC, useEffect, useRef, useState } from "react";
import {format} from 'date-fns'
import { pusherClient } from "@/lib/pusher";

interface MessagesProps {
  initialMessages: Message[];
  sessionId: string;
  chatId:string;
}

const Messages: FC<MessagesProps> = ({ initialMessages, sessionId, chatId }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const scrollDownRef = useRef<HTMLDivElement | null>(null);

  useEffect(()=> {
    pusherClient.subscribe(
      toPusherKey(`chat:${chatId}`)
    );

    const messageHandler = (message:Message) => {
        setMessages((prev) => [message, ...prev])
    };

    pusherClient.bind("incoming-message", messageHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`chat:${chatId}`)
      );
      pusherClient.unbind("incoming-message", messageHandler);
    };
  },[chatId])


  const formatTimastamp = (timestamp:number) => {
    return format(timestamp, 'HH:mm:ss')
  }

  return (
    <div
      id="messages"
      className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto 
  scrollbar-thumb-blue scrollbar-thumb-rounded 
  scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      <div ref={scrollDownRef} />

      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === sessionId;
        const hasNextMessageFromSameUser = messages[index - 1]?.senderId === messages[index].senderId
        return(
            <div key={`${message.id}-${message.timestamp}`} className="chat-message">
                <div className={cn('flex items-end', {'justify-end': isCurrentUser})}>
                    <div className={cn('flex flex-col space-y-2 text-base max-w-xs max-2', {
                    'order-1 items-end':isCurrentUser, 
                    'order-2 items-start':!isCurrentUser
                    })}>
                        <span className={cn('px-4 py-2 rounded-lg inline-block', {
                            'bg-cyan-500 text-white':isCurrentUser,
                            'bg-gray-500 text-black':!isCurrentUser,
                            'rounded-br-none': !hasNextMessageFromSameUser && isCurrentUser,
                            'rounded-bl-none': !hasNextMessageFromSameUser && !isCurrentUser
                        })}>
                            {message.text}{' '}
                            <span className="ml-2 text-xs text-gray-100 ">
                                 {formatTimastamp(message.timestamp)}
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        )
      })}
    </div>
  );
};

export default Messages;
