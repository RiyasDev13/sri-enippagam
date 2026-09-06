import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const productId = product._id || product.id;

  return (
    <div className="product-card">
      <Link to={`/product/${productId}`} className="product-card-img-wrap">
        <img src={product.image} alt={product.name} className="product-card-img" />
        {!product.available && <span className="badge-unavailable">Out of stock</span>}
      </Link>
      <div className="product-card-body">
        <h4>
          <Link to={`/product/${productId}`}>{product.name}</Link>
        </h4>
        <p className="product-card-desc">{product.description}</p>
        <div className="product-card-footer">
          <span className="product-price">₹{product.price}</span>
          <button
            className="btn btn-primary btn-sm"
            disabled={!product.available}
            onClick={() => addToCart(product, 1)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
