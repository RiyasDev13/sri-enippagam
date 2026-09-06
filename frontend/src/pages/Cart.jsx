import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import CartItem from "../components/cart/CartItem.jsx";
import SubBanner from "../components/common/SubBanner.jsx";

export default function Cart() {
  const { items, totalAmount, clearCart } = useCart();

  return (
    <>
      <SubBanner title="Your Cart" />
      <section className="section">
        <div className="container">
          {items.length === 0 ? (
            <div className="empty-state">
              <p>Your cart is empty.</p>
              <Link to="/products/sweets" className="btn btn-primary">
                Browse Products
              </Link>
            </div>
          ) : (
            <>
              <div className="cart-list">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
              <div className="cart-summary">
                <button className="btn btn-outline" onClick={clearCart}>
                  Clear Cart
                </button>
                <div className="cart-total">
                  <span>Total:</span>
                  <strong>₹{totalAmount}</strong>
                </div>
                <Link to="/checkout" className="btn btn-primary">
                  Proceed to Checkout
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
