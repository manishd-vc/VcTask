"use client";

import { ArrowLeft, MoreVertical, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function NewChatPage() {
  const [message, setMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // In a real app, you would send the message to your backend
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 p-4 flex items-center justify-between bg-[#45c1b8] text-white">
        <Link
          href="/doctors"
          className="rounded-full bg-white bg-opacity-20 p-2"
        >
          <ArrowLeft size={20} color="white" />
        </Link>
        <button className="rounded-full bg-white bg-opacity-20 p-2">
          <MoreVertical size={20} color="white" />
        </button>
      </header>

      <main className="flex-1 p-4 pb-24">
        <div className="h-full flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center text-gray-400">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-3">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
            </div>
            <p>No messages</p>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter message"
            className="flex-1 bg-gray-200 rounded-full py-2 px-4 text-gray-800 focus:outline-none"
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
