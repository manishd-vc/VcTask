"use client";
import Image from "next/image";
import aboutImage from "../public/about.jpg";
import AchievementCard from "./achievement-card";
import SectionDescription from "./common/section-description";
import SectionTitle from "./common/section-title";
const list = [
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever",
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever",
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
];
export default function AboutSection() {
  return (
    <section className="about-section xl:py-24 lg:py-20 md:py-16 sm:py-12 py-8 relative overflow-hidden">
      <div className="container  relative z-10">
        <div className="grid grid-cols-7 items-center xl:gap-16 lg:gap-10 md:gap-10 xl:mb-20 lg:mb-16 md:mb-12 sm:mb-8 mb-6 gap-4 w-full">
          <div className="about-image col-span-4">
            <Image
              src={aboutImage}
              alt="about"
              sizes="(max-width: 768px) 60vw, 30vw"
              className="big-image rounded-xl object-cover w-full aspect-[1.5/1] relative z-10 group-hover:object-[60%_0%] transition-all duration-700 ease-in-out"
            />
          </div>
          <div className="about-content col-span-3">
            <SectionTitle text="We Provide Professional Business Solutions." />
            <SectionDescription text="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap" />
            <SectionDescription text="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap" />
            {/* <ListCard list={list} /> */}
          </div>
        </div>
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
