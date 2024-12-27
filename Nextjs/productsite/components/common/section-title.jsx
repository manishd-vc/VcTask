export default function SectionTitle({ text, className }) {
  return (
    <h2
      className={`text-5xl font-semibold lg:mb-8 md:mb-6 mb-4 last:mb-0 text-gray-800 ${
        className ? className : ""
      }`}
    >
      {text}
    </h2>
  );
}
