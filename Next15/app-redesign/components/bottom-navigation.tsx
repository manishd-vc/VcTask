"use client";

import Link from "next/link";
import { Calendar, FileText, DollarSign, Menu } from "lucide-react";

interface BottomNavigationProps {
  activeTab: "documents" | "appointments" | "billing" | "menu";
}

export default function BottomNavigation({ activeTab }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-around px-4 py-3  bg-white border-t border-gray-100 z-10">
      <Link href="/appointments" className="flex flex-col items-center">
        <div
          className={`flex flex-col items-center ${
            activeTab === "appointments" ? "text-[#45c1b8]" : "text-gray-500"
          }`}
        >
          <Calendar size={20} />
          <span className="text-xs mt-1">Appointments</span>
        </div>
      </Link>

      <Link href="/" className="flex flex-col items-center">
        <div
          className={`flex flex-col items-center ${
            activeTab === "documents" ? "text-[#45c1b8]" : "text-gray-500"
          }`}
        >
          <FileText size={20} />
          <span className="text-xs mt-1">Documents</span>
        </div>
      </Link>

      <Link href="/billing" className="flex flex-col items-center">
        <div
          className={`flex flex-col items-center ${
            activeTab === "billing" ? "text-[#45c1b8]" : "text-gray-500"
          }`}
        >
          <DollarSign size={20} />
          <span className="text-xs mt-1">Billing</span>
        </div>
      </Link>

      <Link href="/menu" className="flex flex-col items-center">
        <div
          className={`flex flex-col items-center ${
            activeTab === "menu" ? "text-[#45c1b8]" : "text-gray-500"
          }`}
        >
          <Menu size={20} />
          <span className="text-xs mt-1">Menu</span>
        </div>
      </Link>
    </nav>
  );
}
