'use client'
import { ClientPusher } from '@/lib/pusher'
import { cn, toPusherKey } from '@/lib/utils'
import { Message } from '@/lib/validations/messages'
import { format } from 'date-fns'
import Image from 'next/image'
import { FC, useEffect, useRef, useState } from 'react'

interface MessagesProps {
   initialMessages: Message[]
   sessionId: string
   sessionImg: string | null | undefined
   chatPartner: User
   chatId: string
}

const Messages: FC<MessagesProps> = ({ initialMessages, sessionId, sessionImg, chatPartner, chatId }) => {

   const [messages, setMessages] = useState<Message[]>(initialMessages)
   const scrollDownRef = useRef<HTMLDivElement | null>(null)

   useEffect(() => {
      ClientPusher.subscribe(toPusherKey(`user:${chatId}`))

      const chatMessageHandler = (message: Message) => {
         setMessages((prev) => [message, ...prev])
      }
      ClientPusher.bind('incoming_message', chatMessageHandler)

      return () => {
         ClientPusher.unsubscribe(toPusherKey(`user:${chatId}`))
         ClientPusher.unbind('incoming_message', chatMessageHandler)
      }
   }, [])
   const formatTimeStamp = (timeStamp: number) => {
      return format(timeStamp, 'HH:mm')
   }

   return (<div id='messages' className='flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'>
      <div ref={scrollDownRef} />
      {messages.map((message, index) => {
         const isCurrentuser = message.senderId === sessionId
         const hasNextMessageFromSameUser =
            messages[index - 1]?.senderId === messages[index].senderId
         return (
            <div className='chat-message' key={`${message.id}-${message.timestamp}`}>
               <div className={cn('flex items-end', {
                  'justify-end': isCurrentuser
               })}>
                  <div className={cn('flex flex-col space-y-2 text-base max-w-xs mx-2', {
                     'order-1 items-end': isCurrentuser,
                     'order-2 items-end': !isCurrentuser,
                  })}>

                     <span
                        className={cn('px-4 py-2 rounded-lg inline-block', {
                           'bg-indigo-600 text-white': isCurrentuser,
                           'bg-gray-200 text-gray-900': !isCurrentuser,
                           'rounded-br-none':
                              !hasNextMessageFromSameUser && isCurrentuser,
                           'rounded-bl-none':
                              !hasNextMessageFromSameUser && !isCurrentuser,
                        })}>
                        {message.text}{' '}
                        <span className='ml-2 text-xs text-gray-400'>
                           {formatTimeStamp(message.timestamp)}
                        </span>
                     </span>
                  </div>
                  <div
                     className={cn('relative w-6 h-6', {
                        'order-2': isCurrentuser,
                        'order-1': !isCurrentuser,
                        invisible: hasNextMessageFromSameUser,
                     })}>
                     <Image fill src={
                        isCurrentuser ? (sessionImg as string) : chatPartner.image
                     }
                        alt='Profile picture'
                        referrerPolicy='no-referrer'
                        className='rounded-full' />

                  </div>
               </div>
            </div>
         )
      })}


   </div>)
}

export default Messages