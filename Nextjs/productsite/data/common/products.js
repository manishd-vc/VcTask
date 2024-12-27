export const productsData = Array.from({ length: 50 }, (_, index) => {
  const id = index + 1;
  const images = [
    "/images/tiles1.png",
    "/images/tiles2.png",
    "/images/tiles3.png",
    "/images/tiles4.png",
  ];
  return {
    id: `product${id}`,
    title: `Product ${id}`,
    image: images[index % images.length],
    description: `Product ${id} is crafted with care to provide durability and style. It features a premium ceramic material with a glossy finish, perfect for enhancing the aesthetic of bathrooms and kitchens.`,
    material: "Ceramic",
    finish: "Glossy Finish",
    type: "Wall Tiles",
    size: `${300 + id} x ${450 + id} mm`,
    suitableFor: `Ideal for use as Bathroom Tiles, Kitchen Tiles, and more.`,
    relatedImages: [
      images[(index + 1) % images.length],
      images[(index + 2) % images.length],
      images[(index + 3) % images.length],
    ],
  };
});
