"use client";

import BottomNavigation from "@/components/bottom-navigation";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Bell,
  MessageSquare,
  MessageSquarePlus,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    image: null,
  },
  {
    id: 2,
    name: "Dr. Michael Williams",
    specialty: "Dermatologist",
    image: null,
  },
  {
    id: 3,
    name: "Dr. Emily Chen",
    specialty: "Pediatrician",
    image: null,
  },
  {
    id: 4,
    name: "Dr. David Rodriguez",
    specialty: "Neurologist",
    image: null,
  },
  {
    id: 5,
    name: "Dr. Lisa Thompson",
    specialty: "Oncologist",
    image: null,
  },
  {
    id: 6,
    name: "Dr. James Wilson",
    specialty: "Orthopedic Surgeon",
    image: null,
  },
  {
    id: 7,
    name: "Dr. Jennifer Martinez",
    specialty: "Ophthalmologist",
    image: null,
  },
  {
    id: 8,
    name: "Dr. Robert Taylor",
    specialty: "Psychiatrist",
    image: null,
  },
];

export default function Doctors() {
  const router = useRouter();
  const [selectedDoctors, setSelectedDoctors] = useState<number[]>([]);

  const toggleDoctor = (id: number) => {
    setSelectedDoctors((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 p-4 flex items-center justify-between bg-white border-b border-gray-100">
        <div className="text-lg font-semibold">Icon | Wellness</div>
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
        <div className="flex justify-end items-center mb-4">
          <button
            className="bg-blue-50 text-[#45c1b8] px-4 py-2 rounded-md flex items-center font-medium"
            disabled={selectedDoctors.length === 0}
            onClick={() => {
              if (selectedDoctors.length > 0) {
                router.push(`/chat/new?doctors=${selectedDoctors.join(",")}`);
              }
            }}
          >
            <MessageSquarePlus size={16} className="mr-2" />
            Create Chat
          </button>
        </div>
        <div className="grid gap-4">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-md shadow-sm">
              <div className="flex items-center p-3">
                <div className="w-10 h-10 bg-[#E8F8F7] rounded-full flex items-center justify-center">
                  <UserRound size={18} className="text-[#45C1B8]" />
                </div>
                <div className="ml-3 flex-1">
                  <div className="text-sm font-medium mb-1">{doctor.name}</div>
                  <div className="text-sm text-gray-500">
                    {doctor.specialty}
                  </div>
                </div>
                <Checkbox
                  checked={selectedDoctors.includes(doctor.id)}
                  onCheckedChange={() => toggleDoctor(doctor.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNavigation activeTab="documents" />
    </div>
  );
}
