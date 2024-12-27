import { productsData } from "@/data/common/products";
import ProductWithThumbnails from "./product-with-thumbnails";

export default function ProductDetailsSection({ productId }) {
  const product = productsData?.find((prod) => prod?.id === productId);

  return (
    <section className="product-details-section xl:py-24 lg:py-20 md:py-16 sm:py-12 py-8 relative overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="images">
            <ProductWithThumbnails product={product} />
          </div>
          <div className="details">
            <h1 className="text-3xl font-bold mb-4">{product?.title}</h1>
            <p className="text-gray-600 mb-6">{product?.description}</p>
            <table>
              <thead>
                <tr>
                  <th className="py-3 text-left text-2xl font-semibold">
                    Details
                  </th>
                  <th className="py-3"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2">
                    <strong>Material:</strong>
                  </td>
                  <td className="py-2">{product?.material}</td>
                </tr>
                <tr>
                  <td className="py-2">
                    <strong>Finish:</strong>
                  </td>
                  <td className="py-2">{product?.finish}</td>
                </tr>
                <tr>
                  <td className="py-2">
                    <strong>Type:</strong>
                  </td>
                  <td className="py-2">{product?.type}</td>
                </tr>
                <tr>
                  <td className="py-2">
                    <strong>Size:</strong>
                  </td>
                  <td className="py-2">{product?.size}</td>
                </tr>
                <tr>
                  <td className="py-2">
                    <strong>SuitableFor:</strong>
                  </td>
                  <td className="py-2">{product?.suitableFor}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
