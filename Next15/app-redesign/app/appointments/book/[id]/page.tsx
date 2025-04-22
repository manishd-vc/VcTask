"use client";

import { ArrowLeft, Calendar, Star, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock provider data - in a real app, this would come from API based on the ID
const providers = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Physical Therapy",
    rating: 4.5,
    reviews: 49,
    services: [
      { name: "Initial Consultation - No Charge", duration: "60 Min" },
      { name: "Psychiatric Diagnostic Evaluation", duration: "60 Min" },
      { name: "Psychotherapy", duration: "60 Min" },
    ],
    locations: ["Video Office", "Main Office", "Downtown Clinic"],
    times: [
      "9:00 AM",
      "9:30 AM",
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "11:30 AM",
      "12:00 PM",
      "12:30 PM",
      "1:00 PM",
    ],
  },
  {
    id: 2,
    name: "Dr. Michael Williams",
    specialty: "Occupational Therapy",
    rating: 4.8,
    reviews: 37,
    services: [
      { name: "Initial Consultation - No Charge", duration: "45 Min" },
      { name: "Occupational Assessment", duration: "60 Min" },
      { name: "Therapy Session", duration: "50 Min" },
    ],
    locations: ["Video Office", "West Side Clinic"],
    times: [
      "9:00 AM",
      "9:30 AM",
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "11:30 AM",
      "12:00 PM",
      "12:30 PM",
      "1:00 PM",
    ],
  },
];

export default function BookAppointmentPage({
  params,
}: {
  params: { id: string };
}) {
  const providerId = parseInt(params.id);
  const provider = providers.find((p) => p.id === providerId);

  const [selectedService, setSelectedService] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  if (!provider) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <p>Provider not found</p>
        <Link href="/appointments/request" className="text-[#45c1b8] mt-4">
          Go back
        </Link>
      </div>
    );
  }

  const handleBooking = () => {
    // In a real app, this would send a request to your backend
    alert(
      `Appointment request submitted for ${selectedService} with ${provider.name}`
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="sticky top-0 z-10 p-4 flex items-center justify-between bg-white border-b border-gray-100">
        <div className="flex items-center">
          <Link href="/appointments/request" className="text-gray-700 mr-4">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-lg font-semibold">Book Appointment</h1>
        </div>
      </header>

      <main className="flex-1 px-4 pb-20">
        <div className="py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold">{provider.name}</h2>
          <p className="text-gray-500 text-sm mt-1">{provider.specialty}</p>

          <div className="flex items-center mt-1">
            <div className="flex text-yellow-400 mr-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
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
            <span className="text-sm font-medium mr-1">{provider.rating}</span>
            <span className="text-sm text-gray-500">
              | {provider.reviews} Reviews
            </span>
          </div>
        </div>

        <div className="py-4 border-b border-gray-200">
          <h3 className="font-bold mb-3">Select Service</h3>
          <div className="space-y-3">
            {provider.services.map((service) => (
              <div
                key={service.name}
                className={`p-3 rounded-md cursor-pointer ${
                  selectedService === service.name ? "bg-gray-100" : ""
                }`}
                onClick={() => setSelectedService(service.name)}
              >
                <div className="font-medium">{service.name}</div>
                <div className="text-sm text-gray-500">
                  ({service.duration})
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-right">
            <button className="text-[#45c1b8] text-sm">See all...</button>
          </div>
        </div>

        <div className="py-4 border-b border-gray-200">
          <h3 className="font-bold mb-3">Select Location</h3>
          <div className="space-y-3">
            {provider.locations.map((location) => (
              <div
                key={location}
                className={`p-3 rounded-md cursor-pointer ${
                  selectedLocation === location ? "bg-gray-100" : ""
                }`}
                onClick={() => setSelectedLocation(location)}
              >
                <div className="font-medium">{location}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="py-4">
          <div className="mt-2">
            <p className="text-gray-600 mb-2">session</p>
            <button className="flex items-center justify-between w-full p-3 bg-gray-100 rounded-md">
              <div className="flex items-center">
                <Calendar className="text-[#45c1b8] mr-2" size={20} />
                <span>Select Date</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </div>

          <div className="mt-4">
            <h3 className="font-bold mb-3">Time</h3>
            <div className="grid grid-cols-3 gap-3">
              {provider.times.map((time) => (
                <button
                  key={time}
                  className={`py-2 rounded-md text-center text-sm ${
                    selectedTime === time
                      ? "bg-[#45c1b8] text-white"
                      : "border border-gray-200"
                  }`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <button
            className="w-full py-2 rounded-md font-medium bg-[#45c1b8] text-white"
            onClick={handleBooking}
          >
            Request Now
          </button>
        </div>
      </main>
    </div>
  );
}
