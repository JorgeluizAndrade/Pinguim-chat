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
      <div className='text-2xl font-semibold text-slate-950'>
        <h4>Hi {`${session.user.name}`}, Welcome to Pinguim Chat</h4>
      </div>
    <div className="container py-4 mt-10">
      <h1 className="font-bold text-3xl mb-8 text-slate-700">Recent Chats</h1>
      {friendsLastMessage.length === 0 ? (<p>Not to show here</p>) : (
        friendsLastMessage.map((friend)=> (
          <div
          className="relative border-2 border-gray-600 px-4 py-6 rounded-lg transform transition duration-700 hover:scale-95 hover:shadow-[-9px_-7px_49px_11px_#2818633E] cursor-pointer"
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
                <h4 className='text-lg font-mono'>{friend.name}</h4>
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
