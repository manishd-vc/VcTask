"use client";

import { ArrowLeft, Calendar, Video } from "lucide-react";
import Link from "next/link";

export default function NotificationsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="p-4 flex items-center bg-white border-b border-gray-100">
        <Link href="/" className="text-[#45c1b8] mr-4">
          <ArrowLeft size={24} />
        </Link>
        <div className="text-lg font-bold">Notification</div>
      </header>

      <main className="flex-1 p-4">
        <div className="grid gap-4">
          <div className="bg-green-50 shadow-sm rounded-md p-3 flex items-start">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-[#45c1b8] mr-4 flex-shrink-0">
              <Calendar size={18} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-lg">Appointment Success</h3>
                <span className="text-gray-500 text-sm">1h</span>
              </div>
              <p className="text-gray-700">
                Congratulations - your appointment is confirmed! We're looking
                forward to meeting with you.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 shadow-sm rounded-md p-4 flex items-start">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mr-4 flex-shrink-0">
              <Calendar size={18} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-lg">Appointment Changed</h3>
                <span className="text-gray-500 text-sm">1h</span>
              </div>
              <p className="text-gray-700">
                Congratulations - your appointment is confirmed! We're looking
                forward to meeting with you.
              </p>
            </div>
          </div>

          <div className="bg-green-50 shadow-sm rounded-md p-3 flex items-start">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-[#45c1b8] mr-4 flex-shrink-0">
              <Video size={18} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-lg">
                  Video Call Appointment
                </h3>
                <span className="text-gray-500 text-sm">1h</span>
              </div>
              <p className="text-gray-700">
                Congratulations - your appointment is confirmed! We're looking
                forward to meeting with you.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
