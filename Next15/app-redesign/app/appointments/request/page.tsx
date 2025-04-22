"use client";

import { ArrowLeft, Star, Clock, Calendar, MapPin } from "lucide-react";
import Link from "next/link";

const providers = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Physical Therapy",
    rating: 4.5,
    reviews: 49,
    location: "New York Medical Center",
    availability: ["Mon", "Wed", "Fri"],
  },
  {
    id: 2,
    name: "Dr. Michael Williams",
    specialty: "Occupational Therapy",
    rating: 4.8,
    reviews: 37,
    location: "Downtown Wellness Clinic",
    availability: ["Tue", "Thu", "Sat"],
  },
];

export default function RequestAppointmentPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 p-4 flex items-center justify-between bg-white border-b border-gray-100">
        <div className="flex items-center">
          <Link href="/appointments" className="text-gray-700 mr-4">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-lg font-semibold">Request an appointment</h1>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="space-y-6">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="bg-white rounded-md shadow-sm overflow-hidden"
            >
              <div className="p-4">
                <h2 className="text-lg font-bold">{provider.name}</h2>
                <p className="text-gray-500 mt-1 mb-3 text-sm">
                  {provider.specialty}
                </p>

                <div className="flex items-center mb-4 text-sm">
                  <div className="flex text-yellow-400 mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        fill={
                          star <= Math.floor(provider.rating)
                            ? "currentColor"
                            : "none"
                        }
                        stroke={
                          star <= Math.floor(provider.rating)
                            ? "none"
                            : "currentColor"
                        }
                      />
                    ))}
                  </div>
                  <span className="font-medium mr-2">{provider.rating}</span>
                  <span className="text-gray-500">
                    | {provider.reviews} Reviews
                  </span>
                </div>

                <div className="flex items-center text-gray-600 mb-3 text-sm">
                  <MapPin size={18} className="mr-2 text-[#45c1b8]" />
                  <span>{provider.location}</span>
                </div>

                <div className="flex items-center text-gray-600 mb-5 text-sm">
                  <Calendar size={18} className="mr-2 text-[#45c1b8]" />
                  <span>Available: {provider.availability.join(", ")}</span>
                </div>

                <Link href={`/appointments/book/${provider.id}`}>
                  <button className="w-full py-2 bg-[#E7F9F7] text-[#45c1b8] rounded-md font-medium">
                    Book Appointment
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
