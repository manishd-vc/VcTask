export default function ListCard({ list }) {
  return (
    <ul className="pl-5 list-disc ">
      {list?.map((item, index) => (
        <li key={index} className="md:mb-6 mb-4 last:mb-0">
          {item}
        </li>
      ))}
    </ul>
  );
}
