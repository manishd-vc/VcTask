"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductWithThumbnails({ product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  return (
    <div className="flex w-full gap-3">
      <div className="flex flex-col gap-3">
        {product?.relatedImages?.map((image, index) => (
          <button
            key={index}
            className={`relative w-20 h-20 cursor-pointer rounded-md overflow-hidden hover:scale-105 transition-all duration-300 ease-in-out ${
              selectedImage === index ? "ring-2 ring-cyan-500" : ""
            }`}
            onClick={() => setSelectedImage(index)}
          >
            <Image
              src={image}
              alt={`${product?.title} thumbnail ${index + 1}`}
              fill
              className="object-cover "
              sizes="(max-width: 768px) 120px, 120px"
            />
          </button>
        ))}
      </div>
      <div className="relative aspect-square overflow-hidden rounded-lg flex-1">
        <Image
          src={product?.relatedImages?.[selectedImage]}
          alt={product?.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </div>
  );
}
