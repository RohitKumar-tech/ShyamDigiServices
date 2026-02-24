import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaLock, FaTruck, FaCreditCard } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './CheckoutPage.css';

const API = process.env.REACT_APP_API_URL || '';

function loadRazorpay() {
  return new Promise(resolve => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (cartItems.length === 0) {
    return (
      <div className="container checkout-empty">
        <h2>No items in cart</h2>
        <Link to="/" className="btn btn-buy">Shop Now</Link>
      </div>
    );
  }

  const items = cartItems.map(item => ({
    product_id: item.id,
    product_name: item.name,
    price: item.price,
    quantity: item.quantity,
    subtotal: item.price * item.quantity,
  }));

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCOD = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          customer_address: form.address,
          items,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order failed');
      clearCart();
      navigate(`/order-success/${data.orderId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpay = async () => {
    setLoading(true);
    setError('');
    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error('Could not load payment gateway. Please try COD.');

      const res = await fetch(`${API}/api/razorpay/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          customer_address: form.address,
          items,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not initiate payment');

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Shyam Digi Services',
        description: `Order #ORD${data.orderId}`,
        order_id: data.razorpayOrderId,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: '#e53935' },
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${API}/api/razorpay/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: data.orderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error || 'Payment verification failed');
            clearCart();
            navigate(`/order-success/${verifyData.orderId}`);
          } catch (err) {
            setError(err.message);
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      setError('Please fill in Name, Phone and Address.');
      return;
    }
    if (paymentMethod === 'COD') {
      handleCOD();
    } else {
      handleRazorpay();
    }
  };

  return (
    <div className="container checkout-page">
      <div className="checkout-header">
        <Link to="/cart" className="back-link"><FaArrowLeft /> Back to Cart</Link>
        <h1>Checkout</h1>
      </div>

      <div className="checkout-layout">
        {/* Customer Form */}
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="checkout-section">
            <h2>Delivery Details</h2>
            <div className="form-group">
              <label>Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit mobile number" required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="For order confirmation (optional)" />
            </div>
            <div className="form-group">
              <label>Full Delivery Address *</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="House/Flat No., Street, Area, City, State, PIN Code"
                rows="3"
                required
              />
            </div>
          </div>

          <div className="checkout-section">
            <h2>Payment Method</h2>
            <div className="payment-options">
              <label className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                />
                <FaTruck className="payment-icon" />
                <div>
                  <strong>Cash on Delivery</strong>
                  <p>Pay when your order arrives</p>
                </div>
              </label>
              <label className={`payment-option ${paymentMethod === 'ONLINE' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="ONLINE"
                  checked={paymentMethod === 'ONLINE'}
                  onChange={() => setPaymentMethod('ONLINE')}
                />
                <FaCreditCard className="payment-icon" />
                <div>
                  <strong>Online Payment</strong>
                  <p>UPI, Cards, Net Banking via Razorpay</p>
                </div>
              </label>
            </div>
          </div>

          {error && <div className="checkout-error">{error}</div>}

          <button type="submit" className="btn btn-buy btn-full btn-checkout" disabled={loading}>
            <FaLock />
            {loading ? 'Processing...' : paymentMethod === 'COD' ? 'Place Order (COD)' : 'Pay Now'}
          </button>
        </form>

        {/* Order Summary */}
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          <div className="checkout-items">
            {cartItems.map(item => (
              <div className="checkout-item" key={item.id}>
                <div className="checkout-item-img">{item.name.charAt(0)}</div>
                <div className="checkout-item-details">
                  <p className="checkout-item-name">{item.name}</p>
                  <p className="checkout-item-qty">Qty: {item.quantity}</p>
                </div>
                <p className="checkout-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
          <div className="checkout-summary-total">
            <span>Total</span>
            <span>₹{cartTotal.toLocaleString('en-IN')}</span>
          </div>
          <ul className="checkout-perks">
            <li>Free delivery within 2 days</li>
            <li>15 Days return policy</li>
            <li>GST invoice provided</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
