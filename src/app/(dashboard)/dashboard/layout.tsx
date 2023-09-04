import FriendRequestSideBarOptions from "@/components/FriendRequestSideBarOptions";
import MobileLayout from "@/components/MobileLayout";
import SideBarChatList from "@/components/SideBarChatList";
import SignOutButton from "@/components/SignOutButton";
import { Icon, Icons } from "@/components/icons";
import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { SidebarOption } from "@/types/typings";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

interface SideBarOption {
  id: number;
  name: string;
  href: string;
  Icon: Icon;
}

const sideBarOptions: SidebarOption[] = [
  {
    id: 1,
    name: "Add a Pinguim Friend",
    href: "/dashboard/add",
    Icon: "UserPlus",
  },
];

const Layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();
  
  const friends = await getFriendsByUserId(session.user.id)

  const unseeRequestCount = (
    (await fetchRedis(
      "smembers",
      `user:${session.user.id}:incoming_friend_requests`
    )) as User[]
  ).length;
  return (
  
    <div className="w-full flex h-screen">
      <div className="md:hidden">
        <MobileLayout 
          friends={friends}
          session={session}
          sidebarOptions={sideBarOptions}
          unseenRequestCount={unseeRequestCount}
        />
      </div>
      <div className="hidden md:flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-gradient-to-t from-slate-50 to-sky-100 px-6">
        <Link href="/dashboard" className="flex h-16 shrink-0 items-center">
          <Icons.Logo className="h-8 w-auto text-blue-800" />
        </Link>
        {friends.length > 0 ? (<div className="text-xs font-semibold leading-6 flex gap-2 text-gray-400">
          Your Chats
        </div> ) : null}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="felx flex-1 flex-col gap-y-7">
            <li>
               <SideBarChatList sessionId={session.user.id} friends={friends} /> 
            </li>
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400">
                Overview
              </div>
              <ul role="link" className="-mx-2 mt-2 space-y-1 ">
                {sideBarOptions.map((option) => {
                  const Icon = Icons[option.Icon];
                  return (
                    <li key={option.id}>
                      <Link
                        className="text-gray-700 hover:text-indigo-700 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 hover:animate-pulse font-semibold"
                        href={option.href}
                      >
                        <span
                          className="text-gray-400 border-gray-200 group-hover:border-indigo-600 
                          group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center 
                          justify-center rounded-lg border text-[0.625rem] font-medium 
                        bg-white"
                        >
                          <Icon className="h4 w-4" />
                        </span>
                        <span className="trucate ">{option.name}</span>
                      </Link>
                    </li>
                  );
                })}
                <li>
                  <FriendRequestSideBarOptions
                    sessionId={session.user.id}
                    initialUnseeRequestCount={unseeRequestCount}
                  />
                </li>
              </ul>
            </li>
          </ul>
          <li className="-mx-6 mt-auto flex items-center">
            <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-400">
              <div className="relative h-8 w-8">
                <Image
                  fill
                  referrerPolicy="no-referrer"
                  className="rounded-full"
                  src={
                    session.user.image ||
                    "https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_1280.png"
                  }
                  alt="Your profile"
                />
              </div>
              <span className="sr-only">Your Profile</span>
              <div className="flex flex-col ">
                <span aria-hidden="true">{session.user.name}</span>
                <span className="text-xs text-zinc-500" aria-hidden="true">
                  {session.user.email}
                </span>
              </div>
            </div>
            <SignOutButton className="h-full aspect-square" />
          </li>
        </nav>
      </div>
      <aside className="max-h-screen container py-16 md:py-12 w-full">{children}</aside> 
    </div>
  );
};

export default Layout;
