"use client";

import {
  Bell,
  MessageSquare,
  ChevronRight,
  Lock,
  BellRing,
  AlertCircle,
  Shield,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import BottomNavigation from "@/components/bottom-navigation";

export default function MenuPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 p-4 flex items-center justify-between bg-white border-b border-gray-100">
        <div className="font-semibold">Icon | Wellness</div>
        <div className="flex items-center gap-3">
          <Link
            href="/notifications"
            className="p-2 bg-gray-100 rounded-full text-gray-600"
          >
            <Bell size={20} />
          </Link>
          <Link
            href="/chat"
            className="p-2 bg-gray-100 rounded-full text-gray-600"
          >
            <MessageSquare size={20} />
          </Link>
        </div>
      </header>

      <main className="flex-1 p-5 pb-20">
        <div className="grid gap-4">
          {[
            {
              icon: <Lock size={22} />,
              title: "Biometrics",
              href: "/menu/biometrics",
            },
            {
              icon: <BellRing size={22} />,
              title: "Notification Preferences",
              href: "/menu/notifications",
            },
            {
              icon: <AlertCircle size={22} />,
              title: "App Feedback",
              href: "/menu/feedback",
            },
            {
              icon: <Shield size={22} />,
              title: "Privacy Policy",
              href: "/menu/privacy-policy",
            },
            {
              icon: <Shield size={22} />,
              title: "Terms of Use",
              href: "/menu/terms-of-use",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-md shadow-sm overflow-hidden"
            >
              <Link href={item.href} className="flex items-center p-3">
                <div className="w-10 h-10 flex items-center justify-center text-gray-700">
                  {item.icon}
                </div>
                <div className="ml-3 flex-1">
                  <div className="font-medium">{item.title}</div>
                </div>
                <ChevronRight className="text-gray-400" size={20} />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          App Version: 1.0.0(1)
        </div>

        <div className="mt-6">
          <Link href="/login" className="block w-full">
            <button className="w-full bg-blue-50 text-[#45c1b8] py-2 rounded-md font-medium flex items-center justify-center">
              <LogOut className="mr-2" size={20} />
              Logout
            </button>
          </Link>
        </div>
      </main>

      <BottomNavigation activeTab="menu" />
    </div>
  );
}
