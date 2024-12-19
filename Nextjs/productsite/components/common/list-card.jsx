export default function ListCard({ list }) {
  return (
    <ul>
      {list.map((item, index) => (
        <li key={index} className="md:mb-3 mb-2 last:mb-0">
          {item}
        </li>
      ))}
    </ul>
  );
}
