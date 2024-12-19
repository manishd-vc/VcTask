import ListCard from "./common/list-card";
import SectionDescription from "./common/section-description";
import SectionTitle from "./common/section-title";
const list = [
  "We Care About Your Business Plan. We Care About Your Business Plan.",
  "We Care About Your Business Plan. We Care About Your Business Plan.",
  "We Care About Your Business Plan. We Care About Your Business Plan.",
  "We Care About Your Business Plan. We Care About Your Business Plan.",
  "We Care About Your Business Plan. We Care About Your Business Plan.",
  "We Care About Your Business Plan. We Care About Your Business Plan.",
];
export default function AboutSection() {
  return (
    <section className="about-section 2xl:py-24 xl:py-20 lg:py-16 py-12">
      <div className="container">
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="about-image"></div>
          <div className="about-content">
            <SectionTitle text="We Care About Your Business Plan." />
            <SectionDescription text="We Care About Your Business Plan. We Care About Your Business Plan. We Care About Your Business Plan. We Care About Your Business Plan. We Care About Your Business Plan. We Care About Your Business Plan. We Care About Your Business Plan. We Care About Your Business Plan. We Care About Your Business Plan." />
            <ListCard list={list} />
          </div>
        </div>
      </div>
    </section>
  );
}
