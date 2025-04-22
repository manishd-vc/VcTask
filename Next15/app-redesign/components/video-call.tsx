"use client";

import { Mic, MicOff, Camera, CameraOff, PhoneOff } from "lucide-react";
import { useState } from "react";

interface VideoCallProps {
  doctorName: string;
  onEndCall: () => void;
}

export default function VideoCall({ doctorName, onEndCall }: VideoCallProps) {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Main video area */}
      <div className="flex-1 relative">
        {/* Doctor's video placeholder */}
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          {isCameraOn ? (
            <div className="w-24 h-24 rounded-full bg-blue-400 flex items-center justify-center">
              <span className="text-white text-3xl">
                {doctorName.split(" ")[1][0]}
              </span>
            </div>
          ) : (
            <div className="text-white text-xl">Camera Off</div>
          )}
        </div>

        {/* Patient's video (small overlay) */}
        <div className="absolute bottom-4 right-4 w-1/4 aspect-video bg-gray-700 rounded-md overflow-hidden border-2 border-white shadow-lg">
          {isCameraOn ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-600">
              <span className="text-white">You</span>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-600">
              <CameraOff className="text-white" size={24} />
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-black p-4 flex items-center justify-center space-x-6">
        <button
          onClick={() => setIsMicOn(!isMicOn)}
          className={`${
            isMicOn ? "bg-gray-700" : "bg-red-500"
          } p-3 rounded-full`}
        >
          {isMicOn ? (
            <Mic className="text-white" size={24} />
          ) : (
            <MicOff className="text-white" size={24} />
          )}
        </button>

        <button
          onClick={() => setIsCameraOn(!isCameraOn)}
          className={`${
            isCameraOn ? "bg-gray-700" : "bg-red-500"
          } p-3 rounded-full`}
        >
          {isCameraOn ? (
            <Camera className="text-white" size={24} />
          ) : (
            <CameraOff className="text-white" size={24} />
          )}
        </button>

        <button onClick={onEndCall} className="bg-red-500 p-3 rounded-full">
          <PhoneOff className="text-white" size={24} />
        </button>
      </div>
    </div>
  );
}
