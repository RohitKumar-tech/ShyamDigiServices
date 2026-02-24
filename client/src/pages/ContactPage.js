import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaClock } from 'react-icons/fa';
import './ContactPage.css';

const API = process.env.REACT_APP_API_URL || '';

function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      setStatus({ type: 'error', msg: 'Name and phone are required.' });
      return;
    }
    try {
      const res = await fetch(`${API}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus({ type: 'success', msg: 'Inquiry submitted! We will contact you soon.' });
        setForm({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus({ type: 'error', msg: 'Failed to submit. Please try again.' });
      }
    } catch {
      setStatus({ type: 'error', msg: 'Network error. Please try again.' });
    }
  };

  return (
    <div className="container contact-page">
      <h1>Contact Us</h1>
      <p className="contact-subtitle">
        Get in touch with Shyam Digi Services for bulk orders, pricing, and inquiries.
      </p>

      <div className="contact-grid">
        <div className="contact-info-cards">
          <div className="contact-card">
            <FaMapMarkerAlt className="contact-card-icon" />
            <h3>Address</h3>
            <p>Shyam Digi Services<br />Shop No. 1, Bajaja Gali<br />Bakerganj, Patna - 800004</p>
            <a
              href="https://maps.google.com/?q=Bakerganj+gola+shyam+digi+services+bajaja+gali+patna+800004"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '0.85rem', color: '#e53935' }}
            >
              View on Google Maps
            </a>
          </div>
          <div className="contact-card">
            <FaPhone className="contact-card-icon" />
            <h3>Phone</h3>
            <p>Rashmi Saraf: <a href="tel:+917004383597">7004383597</a></p>
            <p>Ravi Kumar: <a href="tel:+919576778992">9576778992</a></p>
            <p><a href="tel:+919386673993">9386673993</a></p>
          </div>
          <div className="contact-card">
            <FaWhatsapp className="contact-card-icon whatsapp" />
            <h3>WhatsApp</h3>
            <a href="https://wa.me/917004383597" target="_blank" rel="noopener noreferrer">
              Chat with us
            </a>
          </div>
          <div className="contact-card">
            <FaEnvelope className="contact-card-icon" />
            <h3>Email</h3>
            <a href="mailto:shyamdigiservices@gmail.com">shyamdigiservices@gmail.com</a>
          </div>
          <div className="contact-card">
            <FaClock className="contact-card-icon" />
            <h3>Hours</h3>
            <p>Open 24/7<br />Delivery in 2 Days</p>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Send us an Inquiry</h2>

          {status && (
            <div className={`form-status ${status.type}`}>{status.msg}</div>
          )}

          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              required
            />
          </div>
          <div className="form-group">
            <label>Phone *</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="Your phone number"
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="Your email (optional)"
            />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              placeholder="Tell us about your requirements..."
              rows="4"
            ></textarea>
          </div>
          <button type="submit" className="btn btn-buy btn-lg" style={{ width: '100%' }}>
            Submit Inquiry
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactPage;
