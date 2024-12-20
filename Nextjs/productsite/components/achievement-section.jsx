import AchievementCard from "./achievement-card";

export default function AchievementSection() {
  return (
    <section className="achievement-section">
      <div className="container">
        <div className="grid grid-cols-4 lg:gap-6 md:gap-4 gap-3 w-full">
          <AchievementCard />
          <AchievementCard />
          <AchievementCard />
          <AchievementCard />
        </div>
      </div>
    </section>
  );
}
