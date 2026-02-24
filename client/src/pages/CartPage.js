import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './CartPage.css';

function CartPage() {
  const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="container cart-empty">
        <FaShoppingCart className="cart-empty-icon" />
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
        <Link to="/" className="btn btn-buy">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <div className="cart-header">
        <Link to="/" className="back-link"><FaArrowLeft /> Continue Shopping</Link>
        <h1>Your Cart</h1>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map(item => (
            <div className="cart-item" key={item.id}>
              <div className="cart-item-image">
                <span>{item.name.charAt(0)}</span>
              </div>
              <div className="cart-item-info">
                <Link to={`/product/${item.slug}`} className="cart-item-name">{item.name}</Link>
                <p className="cart-item-price">₹{item.price.toLocaleString('en-IN')} each</p>
              </div>
              <div className="cart-item-controls">
                <div className="qty-control">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                    <FaMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    <FaPlus />
                  </button>
                </div>
                <p className="cart-item-subtotal">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                <button className="cart-remove" onClick={() => removeFromCart(item.id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-rows">
            {cartItems.map(item => (
              <div className="summary-row" key={item.id}>
                <span>{item.name} × {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
          <div className="summary-divider" />
          <div className="summary-total">
            <span>Total</span>
            <span>₹{cartTotal.toLocaleString('en-IN')}</span>
          </div>
          <p className="summary-note">Free delivery within 2 days | GST Invoice included</p>
          <button className="btn btn-buy btn-full" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
