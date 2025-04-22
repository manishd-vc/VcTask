"use client";

import {
  Bell,
  MessageSquare,
  Calendar,
  Clock,
  Video,
  Phone,
  MapPin,
  User,
  Info,
} from "lucide-react";
import Link from "next/link";
import BottomNavigation from "@/components/bottom-navigation";

export default function AppointmentsPage() {
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Appointments</h2>
          <Link href="/appointments/request">
            <button className="bg-blue-50 text-[#45c1b8] px-4 py-2 rounded-md flex items-center font-medium">
              Add request <span className="ml-1 text-xl">+</span>
            </button>
          </Link>
        </div>

        <div className="grid gap-5">
          {[
            {
              icon: <Video size={24} className="text-blue-500" />,
              color: "blue",
              type: "Telehealth Appointment",
            },
            {
              icon: <Phone size={24} className="text-green-500" />,
              color: "green",
              type: "Phone Consultation",
            },
            {
              icon: <MapPin size={24} className="text-orange-500" />,
              color: "orange",
              type: "In-Person Visit",
            },
          ].map((item, index) => (
            <Link href={`/appointments/join/${index + 1}`} key={index}>
              <div className="bg-white rounded-md shadow-sm overflow-hidden cursor-pointer">
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="text-[#45c1b8]" size={20} />
                    <span className="font-medium text-sm">Monday, 26 July</span>
                    <span className="mx-1 text-gray-400">|</span>
                    <div className="flex items-center">
                      <Clock className="text-[#45c1b8] mr-1" size={20} />
                      <span className="text-sm">09:00 - 10:00</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold mb-3">
                    {index === 0
                      ? "Dr. Parth Pandya"
                      : `Dr. John Smith ${index + 1}`}
                  </h3>

                  <div className="flex items-center gap-2 mb-2 text-sm">
                    <div className="flex items-center text-[#45c1b8]">
                      <span className="text-2xl mr-1">#</span>
                      <span>{item.type}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-5 text-sm">
                    <div className="flex items-center gap-1">
                      <User className="text-[#45c1b8]" size={18} />
                      <span>Clinician</span>
                      <span className="text-[#45c1b8] ml-1">Profile</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Info className="text-[#45c1b8]" size={18} />
                      <span>Appt.</span>
                      <span className="text-[#45c1b8] ml-1">Details</span>
                    </div>
                  </div>

                  <button className="w-full bg-[#45c1b8] text-white py-2 rounded-md font-medium">
                    Join Appointment
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <BottomNavigation activeTab="appointments" />
    </div>
  );
}
