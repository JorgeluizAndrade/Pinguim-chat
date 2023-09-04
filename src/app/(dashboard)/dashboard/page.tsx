import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { chatHrefConstructor } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";


const page = async ({}) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const friends = await getFriendsByUserId(session.user.id);

  const friendsLastMessage = await Promise.all(
    friends.map(async (friend) => {
      const [lastMessageRaw] = (await fetchRedis(
        "zrange",
        `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`, 
        -1,
        -1
      )) as string[];

      const lastMessage = JSON.parse(lastMessageRaw) as Message
      
      return {
        ...friend,
        lastMessage
      }
    })
  );

  return (
    <div>

    <div className="animate-pulse flex justify-center">
      <h1
        className="text-5xl 
      bg-gradient-to-r from-neutral-600 to-blue-400 bg-clip-text text-transparent"
      >
        Welcome To Pinguim Chat!
      </h1>
    </div>

    <div className="container py-4 mt-10">
      <h1 className="font-bold text-3xl mb-8 text-neutral-500">Your Recent Chats</h1>
      {friendsLastMessage.length === 0 ? (<p>Not to show here</p>) : (
        friendsLastMessage.map((friend)=> (
          <div
          className="relative bg-zinc-50 border border-zinc-200 p-3 rounded-md"
          key={friend.id}>
            <div className="absolute right-4 inset-y-0 flex items-center">
              <ArrowRight className="w-4 h-4 text-zinc-700"/>
            </div>
            <Link href={`dashboard/chat/${chatHrefConstructor(session.user.id, friend.id)}`}
            className='relative sm:flex'
            >            
               <div className='mb-4 flex-shrink-0 sm:mb-0 sm:mr-4'>
                <div className='relative h-6 w-6'>
                  <Image
                    referrerPolicy='no-referrer'
                    className='rounded-full'
                    alt={`${friend.name} profile picture`}
                    src={friend.image}
                    fill
                  />
                </div>
              </div>
              <div>
                <h4 className='text-lg font-semibold'>{friend.name}</h4>
                <p className='mt-1 max-w-md'>
                  <span className='text-zinc-400'>
                    {friend.lastMessage.senderId === session.user.id
                      ? 'You: '
                      : ''}
                  </span>
                  {friend.lastMessage.text}
                </p>
              </div>
             </Link>
          </div>
        ))
      )}
      </div>
    </div>
  );
};

export default page;
