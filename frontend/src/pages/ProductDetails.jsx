import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../components/common/Loader.jsx";
import { getProduct } from "../services/api.js";
import { useCart } from "../context/CartContext.jsx";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    getProduct(id)
      .then(setProduct)
      .catch(() => setError("Product not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container section"><Loader /></div>;
  if (error || !product)
    return (
      <div className="container section">
        <p className="error-state">{error || "Product not found."}</p>
        <Link to="/products/sweets" className="btn btn-primary">
          Back to Products
        </Link>
      </div>
    );

  return (
    <section className="section">
      <div className="container product-details-grid">
        <img src={product.image} alt={product.name} className="product-details-img" />
        <div className="product-details-info">
          <h1>{product.name}</h1>
          <p className="product-details-category">{product.category}</p>
          <p className="product-details-desc">{product.description}</p>
          <p className="product-details-price">₹{product.price}</p>
          {!product.available && <p className="badge-unavailable">Currently out of stock</p>}

          <div className="qty-selector">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)}>+</button>
          </div>

          <button
            className="btn btn-primary"
            disabled={!product.available}
            onClick={() => addToCart(product, quantity)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
}
