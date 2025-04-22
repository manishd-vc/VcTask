"use client";

import { ChevronRight, FileText } from "lucide-react";
import Link from "next/link";

export default function DocumentsList() {
  return (
    <div className="grid gap-4">
      {[1, 2, 3].map((num) => (
        <Link href="/" key={num}>
          <div className="bg-white rounded-md shadow-sm overflow-hidden">
            <div className="flex items-center p-3">
              <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 mr-3">
                <FileText size={18} />
              </div>
              <div className="flex-1">
                <div className="font-medium mb-1">Document {num}</div>
                <div className="text-sm text-gray-500">April 17, 2025</div>
              </div>
              <ChevronRight className="text-gray-400" size={16} />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
