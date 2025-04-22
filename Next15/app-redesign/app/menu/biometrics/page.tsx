"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function BiometricsPage() {
  const [isEnabled, setIsEnabled] = useState(true);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="p-4 flex items-center bg-white">
        <Link href="/menu" className="text-[#45c1b8] mr-4">
          <ArrowLeft size={24} />
        </Link>
        <div className="text-lg font-bold">Biometrics</div>
      </header>

      <main className="flex-1 p-4">
        <div className="bg-white rounded-md shadow-sm overflow-hidden">
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 flex items-center justify-center text-gray-700">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M8 11.4C8 9.15979 9.79086 7.4 12 7.4C14.2091 7.4 16 9.15979 16 11.4C16 13.0126 15.0193 14.4003 13.6 14.9C13.6 15.0105 13.6 15.1895 13.6 15.3C13.6 15.6866 13.6 15.88 13.564 16.0427C13.5071 16.2916 13.3478 16.5071 13.1273 16.6354C12.9782 16.72 12.7766 16.72 12.3733 16.72H11.6267C11.2234 16.72 11.0218 16.72 10.8727 16.6354C10.6522 16.5071 10.4929 16.2916 10.436 16.0427C10.4 15.88 10.4 15.6866 10.4 15.3C10.4 15.1895 10.4 15.0105 10.4 14.9C8.98066 14.4003 8 13.0126 8 11.4Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div className="ml-3 font-medium">Biometrics</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isEnabled}
                onChange={() => setIsEnabled(!isEnabled)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#45c1b8]"></div>
            </label>
          </div>
        </div>
      </main>
    </div>
  );
}
