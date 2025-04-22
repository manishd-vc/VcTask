"use client";

import { ArrowLeft, Calendar, Clock, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import VideoCall from "@/components/video-call";
import { useRouter } from "next/navigation";

export default function JoinAppointmentPage({
  params,
}: {
  params: { id: string };
}) {
  const [isJoined, setIsJoined] = useState(false);
  const router = useRouter();

  // In a real app, this would be fetched from an API
  const appointmentDetails = {
    doctorName:
      params.id === "1" ? "Dr. Parth Pandya" : `Dr. John Smith ${params.id}`,
    date: "Monday, 26 July",
    startTime: "09:00",
    endTime: "10:00",
    type:
      params.id === "1"
        ? "Telehealth Appointment"
        : params.id === "2"
        ? "Phone Consultation"
        : "In-Person Visit",
  };

  const handleJoinAppointment = () => {
    setIsJoined(true);
    // In a real app, this would connect to a video call service
  };

  const handleCancelAppointment = () => {
    // In a real app, this would call an API to cancel the appointment
    alert("Appointment cancelled");
    router.push("/appointments");
  };

  const handleEndCall = () => {
    setIsJoined(false);
    router.push("/appointments");
  };

  if (isJoined) {
    return (
      <div className="flex flex-col min-h-screen">
        <VideoCall
          doctorName={appointmentDetails.doctorName}
          onEndCall={handleEndCall}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="p-4 flex items-center">
        <Link href="/appointments" className="text-black mr-3">
          <ArrowLeft size={24} />
        </Link>
        <div className="flex-1"></div>
        <Link href="/chat" className="p-2 rounded-full bg-gray-100">
          <MessageSquare size={20} />
        </Link>
      </header>

      <main className="flex-1 flex flex-col">
        <div className="relative w-full h-[300px] bg-blue-50">
          <Image
            src="/images/telehealth-illustration.svg"
            alt="Telehealth illustration"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="px-6 py-4">
          <h1 className="text-xl font-bold mb-3">
            {appointmentDetails.doctorName}
          </h1>
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="text-[#45c1b8]" size={20} />
            <span className="font-medium text-sm">
              {appointmentDetails.date}
            </span>
            <span className="mx-1 text-gray-400">|</span>
            <div className="flex items-center">
              <Clock className="text-[#45c1b8] mr-1" size={20} />
              <span className="text-sm">
                {" "}
                {appointmentDetails.startTime} - {appointmentDetails.endTime}
              </span>
            </div>
          </div>

          <div className="text-lg mb-8">{appointmentDetails.type}</div>

          <div className="mt-auto flex gap-4">
            <button
              onClick={handleCancelAppointment}
              className="w-full py-2 bg-gray-300 rounded-md  font-medium"
            >
              Cancel
            </button>

            <button
              onClick={handleJoinAppointment}
              className="w-full py-2 bg-[#45c1b8] text-white rounded-md  font-medium"
            >
              Join
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
