export default function SlideContent({
  subheading,
  mainHeading1,
  mainHeading2,
  description,
  buttonUrl,
}) {
  return (
    <div className="swiper-slide-inner flex justify-center items-center h-full">
      <div className="slide-bg z-0 font-normal whitespace-nowrap lg:h-[834px] lg:w-[834px] sm:h-[720px] sm:w-[720px] h-[550px] w-[550px] bg-[rgb(22_35_64_/_20%)] flex absolute overflow-auto rounded-[50%] ">
        <div className="slide-bg-inner lg:w-[650px] lg:h-[650px] sm:w-[590px] sm:h-[590px] w-[450px] h-[450px] m-auto rounded-[50%] bg-[rgb(22_35_64_/_59%)]"></div>
      </div>
      <div className="slide-detail relative z-[1] text-center">
        <div className="slide-main-subheading text-white text-xs uppercase leading-5 font-medium tracking-[1px] opacity-0 blur-sm pb-[25px]">
          <span>
            <i className="fa-solid fa-award"></i> {subheading}
          </span>
        </div>
        <div className="slide-main-heading block text-center text-white leading-[normal] font-bold sm:text-[52px] text-[32px] whitespace-normal capitalize pt-0 pb-[23px] px-0">
          <div className="from-left">{mainHeading1}</div>
          <div className="from-right">{mainHeading2}</div>
        </div>
        <div className="slide-des text-center leading-[25px] tracking-[0px] font-light text-sm whitespace-normal min-h-0 min-w-[347px] max-h-[none] max-w-[347px] text-white opacity-0 m-auto pt-0 pb-[25px] px-0 border-0">
          <p>{description}</p>
        </div>
        <div className="slide-cta">
          <a href={buttonUrl} className="slide-btn gradient-btn">
            Get Started Now{" "}
            <span className="flex items-center justify-center w-[42px] h-[42px] absolute -translate-y-2/4 shadow-[0_5px_10px_0_rgba(0,0,0,0.35)] text-[#3c2fc0] rounded-[100%] right-2 top-2/4 bg-white">
              <i className="fa-solid fa-arrow-right"></i>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
