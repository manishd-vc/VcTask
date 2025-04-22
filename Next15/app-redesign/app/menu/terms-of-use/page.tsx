import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="p-4 flex items-center bg-white border-b border-gray-100">
        <Link href="/menu" className="text-[#45c1b8] mr-4">
          <ArrowLeft size={24} />
        </Link>
        <div className="text-lg font-bold">Terms of use</div>
      </header>

      <main className="flex-1">
        <div className="p-4 space-y-8">
          <section>
            <h2 className="text-lg font-bold mb-3">1. Introduction</h2>
            <p className="text-gray-700">
              We respect your privacy and are committed to protecting your
              personal data. This Terms of use explains how we collect, use, and
              share your information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">
              2. Information We Collect
            </h2>
            <p className="text-gray-700">
              We may collect information you provide directly (such as name,
              email), and data automatically collected (such as device info and
              usage data).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">
              3. How We Use Your Information
            </h2>
            <p className="text-gray-700">
              We use your information to: Provide and maintain the app, Improve
              user experience and app performance, Communicate with you,
              including updates or support, Ensure security and prevent fraud,
              Comply with legal obligations
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">
              4. Sharing Your Information
            </h2>
            <p className="text-gray-700">
              We do not sell your personal data. We may share your information
              with: Service Providers who help us operate and improve the app,
              Legal authorities if required by law or to protect our rights,
              Analytics partners (e.g., Google Analytics, Firebase) to
              understand app usage
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">
              5. Your Choices and Rights
            </h2>
            <p className="text-gray-700">
              Depending on your location, you may have rights to: Access or
              request a copy of your personal data, Correct or delete your
              personal data, Opt out of certain data collection (e.g.,
              analytics, personalized ads). You can control permissions (like
              location or camera access) in your device settings.
            </p>
          </section>
        </div>

        <div className="p-6 text-center text-gray-500 text-sm">
          © 2025 wellbeingtales. All rights reserved.
        </div>
      </main>
    </div>
  );
}
