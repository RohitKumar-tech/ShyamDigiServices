import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaClock } from 'react-icons/fa';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-col">
          <h3 className="footer-logo">
            <span className="logo-shyam">Shyam</span>
            <span className="logo-digi">Digi Services</span>
          </h3>
          <p className="footer-about">
            We deal only in high quality FTTH products. Your trusted wholesale supplier for
            networking equipment, fiber tools, and telecom accessories.
          </p>
          <div className="footer-policy">15 Days Return Policy</div>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/category/ont-routers">ONT Routers</Link></li>
            <li><Link to="/category/sfp-modules">SFP Modules</Link></li>
            <li><Link to="/category/fiber-testing">Fiber Testing</Link></li>
            <li><Link to="/category/epon-gpon-olt">OLT Systems</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Categories</h4>
          <ul>
            <li><Link to="/category/range-extenders">Routers & Extenders</Link></li>
            <li><Link to="/category/ladders">Telescopic Ladders</Link></li>
            <li><Link to="/category/power-supply">Power Supply</Link></li>
            <li><Link to="/category/splicing-machines">Splicing Machines</Link></li>
            <li><Link to="/category/landline-phones">Landline Phones</Link></li>
            <li><Link to="/category/fiber-extensions">Fiber Extensions</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact Us</h4>
          <ul className="footer-contact">
            <li>
              <FaMapMarkerAlt />
              <span>Shop No. 1, Bajaja Gali, Bakerganj, Patna - 800004</span>
            </li>
            <li>
              <FaPhone />
              <a href="tel:+917004383597">7004383597</a> / <a href="tel:+919576778992">9576778992</a>
            </li>
            <li>
              <FaWhatsapp />
              <a href="https://wa.me/917004383597" target="_blank" rel="noopener noreferrer">
                WhatsApp Us
              </a>
            </li>
            <li>
              <FaEnvelope />
              <a href="mailto:shyamdigiservices@gmail.com">shyamdigiservices@gmail.com</a>
            </li>
            <li>
              <FaClock />
              <span>Open 24/7 | Delivery in 2 Days</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Shyam Digi Services. All rights reserved.</p>
          <p className="footer-upi">Please pay via UPI only. Other methods may incur 2.25% extra fee.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
