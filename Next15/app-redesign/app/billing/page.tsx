"use client";

import { Bell, MessageSquare, ChevronRight, Clock } from "lucide-react";
import Link from "next/link";
import BottomNavigation from "@/components/bottom-navigation";

const invoices = [
  { id: 1, amount: 100, color: "#1DBDAC" },
  { id: 2, amount: 101, color: "#2B9FCB" },
  { id: 3, amount: 102, color: "#2C78F6" },
  { id: 4, amount: 103, color: "#1DBDAC" },
  { id: 5, amount: 104, color: "#2B9FCB" },
  { id: 6, amount: 105, color: "#2C78F6" },
];

export default function BillingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 p-4 flex items-center justify-between bg-white border-b border-gray-100">
        <div className="font-semibold">Icon | Wellness</div>
        <div className="flex items-center gap-2">
          <Link
            href="/notifications"
            className="p-2 bg-gray-100 rounded-full text-gray-600"
          >
            <Bell size={18} />
          </Link>
          <Link
            href="/chat"
            className="p-2 bg-gray-100 rounded-full text-gray-600"
          >
            <MessageSquare size={18} />
          </Link>
        </div>
      </header>

      <main className="flex-1 p-4 pb-20">
        <div className="bg-blue-50 rounded-md p-4 mb-4">
          <div className="text-center">
            <div className="font-medium text-gray-700">Total Balance</div>
            <div className="text-2xl font-bold text-[#45c1b8] mt-1">$425</div>
          </div>
        </div>

        <div className="grid gap-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="bg-white rounded-md shadow-sm overflow-hidden"
            >
              <Link
                href={`/billing/${invoice.id}`}
                className="flex items-center p-3"
              >
                <div
                  className="w-10 h-10 flex items-center justify-center bg-[#E8F8F7] rounded-full"
                  style={{ color: invoice.color }}
                >
                  <Clock size={18} />
                </div>
                <div className="ml-3 flex-1">
                  <div className="font-medium mb-1">
                    Invoice{" "}
                    <span style={{ color: invoice.color }}>#{invoice.id}</span>
                  </div>
                  <div className="text-sm text-gray-500">Nov 14, 2024</div>
                </div>
                <div className="text-sm font-medium mr-2">
                  ${invoice.amount}
                </div>
                <ChevronRight className="text-gray-400" size={16} />
              </Link>
            </div>
          ))}
        </div>
      </main>

      <BottomNavigation activeTab="billing" />
    </div>
  );
}

function DollarIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
        fill="currentColor"
      />
      <path
        d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z"
        fill="currentColor"
      />
    </svg>
  );
}
