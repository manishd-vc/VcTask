import { Goal } from "lucide-react";

export default function AchievementCard() {
  return (
    <div className="achievement-card flex items-start bg-white rounded-xl overflow-hidden shadow-[0_1px_30px_1px_#ecf2ff]">
      <div className="icon flex items-center justify-center p-3 bg-sky-800 text-white rounded-br-xl">
        <Goal size={46} strokeWidth={1} />
      </div>
      <div className="text p-6">
        <div className="number text-5xl font-bold mb-1">455+</div>
        <p>Overview As a global player in the telecoms</p>
      </div>
    </div>
  );
}
