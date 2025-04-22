"use client";

import { ArrowLeft, MoreVertical, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock chat data
const chats = {
  1: {
    id: 1,
    name: "Parth Pandya",
    messages: [
      {
        id: 1,
        text: "are you coming for an IPL match",
        sender: "them",
        timestamp: "Yesterday",
      },
    ],
  },
  2: {
    id: 2,
    name: "First User",
    messages: [
      {
        id: 1,
        text: "hello",
        sender: "them",
        timestamp: "12/04/2025",
      },
    ],
  },
};

export default function ChatDetailPage({ params }: { params: { id: string } }) {
  const [message, setMessage] = useState("");
  const chatId = parseInt(params.id);
  const chat = chats[chatId as keyof typeof chats];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // In a real app, you would send the message to your backend
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  if (!chat) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50">
        <p>Chat not found</p>
        <Link href="/chat" className="text-[#45c1b8] mt-4">
          Go back
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 p-4 flex items-center justify-between bg-[#45c1b8] text-white">
        <div className="flex items-center">
          <Link
            href="/chat"
            className="rounded-full bg-white bg-opacity-20 p-2 mr-3"
          >
            <ArrowLeft size={20} color="white" />
          </Link>
          <div className="text-xl font-medium">{chat.name}</div>
        </div>
        <button className="rounded-full bg-white bg-opacity-20 p-2">
          <MoreVertical size={20} color="white" />
        </button>
      </header>

      <main className="flex-1 p-4 pb-24">
        {chat.messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-4 flex ${
              msg.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-3/4 rounded-md px-4 py-2 ${
                msg.sender === "me"
                  ? "bg-[#45c1b8] text-white rounded-tr-none"
                  : "bg-white text-gray-800 rounded-tl-none"
              }`}
            >
              <p>{msg.text}</p>
              <p
                className={`text-sm mt-1 text-right ${
                  msg.sender === "me"
                    ? "text-white opacity-80"
                    : "text-gray-500"
                }`}
              >
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-100 rounded-full py-3 px-4 text-gray-800 focus:outline-none"
          />
          <button
            type="submit"
            className="ml-2 w-10 h-10 bg-[#45c1b8] rounded-full flex items-center justify-center text-white"
            disabled={!message.trim()}
          >
            <Send size={18} />
          </button>
        </form>
      </footer>
    </div>
  );
}
