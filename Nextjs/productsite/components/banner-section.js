"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/swiper-bundle.css";
import "swiper/css/effect-fade";
import SlideContent from "./slider-content";
const BannerSection = () => {
  const progressCircle = useRef(null);
  const progressContent = useRef(null);

  const onAutoplayTimeLeft = (s, time, progress) => {
    if (progressCircle.current && progressContent.current) {
      progressCircle.current.style.setProperty("--progress", `${1 - progress}`);
      progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    }
  };

  return (
    <section className="banner-slider h-screen w-full">
      <div className="slider-row h-full w-full">
        <Swiper
          modules={[EffectFade, Autoplay]}
          effect={"fade"}
          navigation={false}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          speed={1000}
          onAutoplayTimeLeft={onAutoplayTimeLeft}
          loop={true}
          className="parallax-slider h-full w-full"
        >
          <SwiperSlide
            style={{
              backgroundImage:
                "url('https://imgpanda.com/upload/ib/7h4GtHmC8Y.jpg')",
            }}
          >
            <SlideContent
              subheading="On demand live support"
              mainHeading1="Delivering creative"
              mainHeading2="digital products"
              description="We're a fully dedicated corporate service agency collaborating with brands all over the world."
              buttonUrl="https://www.fiverr.com/aliali44/develop-or-customize-a-wordpress-theme"
            />
          </SwiperSlide>
          <SwiperSlide
            style={{
              backgroundImage:
                "url('https://imgpanda.com/upload/ib/NqHhOwv4t0.jpg')",
            }}
          >
            <SlideContent
              subheading="On demand live support"
              mainHeading1="Start your online"
              mainHeading2="business today"
              description="We're a fully dedicated corporate service agency collaborating with brands all over the world."
              buttonUrl="https://www.fiverr.com/aliali44/develop-or-customize-a-wordpress-theme"
            />
          </SwiperSlide>
          <SwiperSlide
            style={{
              backgroundImage:
                "url('https://imgpanda.com/upload/ib/bRqJVoCe3b.jpg')",
            }}
          >
            <SlideContent
              subheading="On demand live support"
              mainHeading1="Awesome Solutions"
              mainHeading2="For your Business"
              description="We're a fully dedicated corporate service agency collaborating with brands all over the world."
              buttonUrl="https://www.fiverr.com/aliali44/develop-or-customize-a-wordpress-theme"
            />
          </SwiperSlide>
        </Swiper>
        <div className="autoplay-progress absolute z-10 w-14 h-14 flex items-center justify-center font-[bold] text-white right-4 bottom-4">
          <svg
            viewBox="0 0 48 48"
            ref={(el) => {
              progressCircle.current = el;
            }}
          >
            <circle cx="24" cy="24" r="20"></circle>
          </svg>
          <span
            className="text-xl"
            ref={(el) => {
              progressContent.current = el;
            }}
          ></span>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
