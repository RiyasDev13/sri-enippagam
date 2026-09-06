import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({ products }) {
  if (!products.length) {
    return <p className="empty-state">No products found in this category yet.</p>;
  }
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product._id || product.id} product={product} />
      ))}
    </div>
  );
}
