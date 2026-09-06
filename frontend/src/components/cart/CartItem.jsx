import { useCart } from "../../context/CartContext.jsx";

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item-img" />
      <div className="cart-item-info">
        <h4>{item.name}</h4>
        <p>₹{item.price} each</p>
      </div>
      <div className="cart-item-qty">
        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
        <span>{item.quantity}</span>
        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
      </div>
      <div className="cart-item-total">₹{item.price * item.quantity}</div>
      <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>
        <i className="bi bi-trash"></i>
      </button>
    </div>
  );
}
