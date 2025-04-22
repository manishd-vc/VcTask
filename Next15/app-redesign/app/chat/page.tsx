"use client";

import { ArrowLeft, Search, MessageSquare } from "lucide-react";
import Link from "next/link";

const chats = [
  {
    id: 1,
    name: "Parth Pandya",
    message: "are you coming for an IPL match",
    date: "Yesterday",
    avatar: null,
  },
  {
    id: 2,
    name: "First User",
    message: "hello",
    date: "12/04/2025",
    avatar: null,
  },
];

export default function ChatPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 p-4 flex items-center justify-between bg-white border-b border-gray-100">
        <div className="flex items-center">
          <Link href="/" className="text-[#45c1b8] mr-3">
            <ArrowLeft size={20} />
          </Link>
          <div className="text-lg font-bold">Chat</div>
        </div>
        <Link href="/doctors">
          <button className="text-gray-500">
            <Search size={20} />
          </button>
        </Link>
      </header>

      <main className="flex-1 p-4">
        <div className="grid gap-4">
          {chats.map((chat) => (
            <Link href={`/chat/${chat.id}`} key={chat.id}>
              <div className="bg-white rounded-md shadow-sm overflow-hidden">
                <div className="flex items-center p-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center mr-3">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium mb-1">{chat.name}</div>
                    <div className="text-sm text-gray-500">{chat.message}</div>
                  </div>
                  <div className="text-sm text-gray-500 ml-2">{chat.date}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
