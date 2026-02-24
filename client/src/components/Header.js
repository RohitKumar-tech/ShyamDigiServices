import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPhone, FaSearch, FaBars, FaTimes, FaWhatsapp, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './Header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="container header-top-inner">
          <span className="header-tagline">
            Buy FTTH Equipment & Networking Products in Bulk | Wholesale Supplier
          </span>
          <div className="header-top-right">
            <a href="tel:+917004383597" className="header-phone">
              <FaPhone /> 7004383597
            </a>
            <a
              href="https://wa.me/917004383597"
              className="header-whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="header-main">
        <div className="container header-main-inner">
          <Link to="/" className="logo">
            <span className="logo-shyam">Shyam</span>
            <span className="logo-digi">Digi Services</span>
          </Link>

          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit"><FaSearch /></button>
          </form>

          <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/category/ont-routers" onClick={() => setMenuOpen(false)}>ONT Routers</Link>
            <Link to="/category/range-extenders" onClick={() => setMenuOpen(false)}>Routers</Link>
            <Link to="/category/epon-gpon-olt" onClick={() => setMenuOpen(false)}>OLT</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          </nav>

          <Link to="/cart" className="cart-icon-btn">
            <FaShoppingCart />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
