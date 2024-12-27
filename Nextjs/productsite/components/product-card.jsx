import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <Link
      href={`product-details/${product?.id}`}
      className="product-card even:sm:-mt-10"
    >
      <div className="group relative rounded-xl overflow-hidden">
        <div className="image relative w-full aspect-[1/1] group-hover:scale-110 transition-all duration-500 ease-in-out">
          <Image
            src={product?.image}
            alt="about"
            fill
            sizes="(max-width: 768px) 60vw, 30vw"
            className="object-cover"
          />
        </div>
        <div className="content-layer absolute top-full left-0 w-full h-full bg-gradient-to-t from-cyan-900 from-10% to-transparent group-hover:top-0 transition-all duration-300 ease-in-out" />
        <div className="title text-center p-3 text-white absolute bottom-full w-full opacity-0 group-hover:opacity-100 group-hover:bottom-0 transition-all duration-500 ease-in-out font-semibold text-lg">
          {product?.title}
        </div>
      </div>
    </Link>
  );
}
