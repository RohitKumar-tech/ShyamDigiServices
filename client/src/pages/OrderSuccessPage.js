import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaCheckCircle, FaEnvelope, FaPhone } from 'react-icons/fa';
import './OrderSuccessPage.css';

const API = process.env.REACT_APP_API_URL || '';

function OrderSuccessPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/orders/${orderId}`)
      .then(r => r.json())
      .then(data => {
        setOrder(data.order);
        setItems(data.items);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (!order) {
    return (
      <div className="container success-page">
        <p>Order not found.</p>
        <Link to="/" className="btn btn-buy">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="container success-page">
      <div className="success-card">
        <FaCheckCircle className="success-icon" />
        <h1>Order Placed Successfully!</h1>
        <p className="success-subtitle">Thank you, <strong>{order.customer_name}</strong>!</p>

        <div className="order-id-badge">Order ID: <strong>#ORD{order.id}</strong></div>

        {order.customer_email && (
          <p className="email-notice">
            <FaEnvelope /> Order confirmation sent to <strong>{order.customer_email}</strong>
          </p>
        )}

        <div className="success-details">
          <div className="detail-row">
            <span>Payment Method</span>
            <span>{order.payment_method === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</span>
          </div>
          <div className="detail-row">
            <span>Payment Status</span>
            <span className={order.payment_status === 'paid' ? 'status-paid' : 'status-pending'}>
              {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
            </span>
          </div>
          <div className="detail-row">
            <span>Delivery Address</span>
            <span>{order.customer_address}</span>
          </div>
          <div className="detail-row">
            <span>Estimated Delivery</span>
            <span>Within 2 Days</span>
          </div>
        </div>

        <div className="success-items">
          <h3>Items Ordered</h3>
          {items.map(item => (
            <div className="success-item" key={item.id}>
              <div className="success-item-img">{item.product_name.charAt(0)}</div>
              <div className="success-item-info">
                <p className="success-item-name">{item.product_name}</p>
                <p className="success-item-qty">Qty: {item.quantity}</p>
              </div>
              <p className="success-item-price">₹{item.subtotal.toLocaleString('en-IN')}</p>
            </div>
          ))}
          <div className="success-total">
            <span>Total Paid</span>
            <span>₹{order.total_amount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="success-contact">
          <p>For any queries about your order, contact us:</p>
          <a href="tel:+917004383597" className="contact-btn">
            <FaPhone /> 7004383597
          </a>
        </div>

        <Link to="/" className="btn btn-buy btn-full" style={{ marginTop: 24 }}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default OrderSuccessPage;
