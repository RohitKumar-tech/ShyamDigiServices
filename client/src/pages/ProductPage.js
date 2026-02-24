import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaPhone, FaWhatsapp, FaShoppingCart, FaArrowLeft, FaCheckCircle, FaCheck, FaMinus, FaPlus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './ProductPage.css';

const API = process.env.REACT_APP_API_URL || '';

function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/products/${slug}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return <div className="container" style={{ padding: 40, textAlign: 'center' }}>Product not found.</div>;
  }

  const discount = product.mrp
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="container product-detail">
      <Link to={product.category_slug ? `/category/${product.category_slug}` : '/'} className="back-link">
        <FaArrowLeft /> Back to {product.category_name || 'Products'}
      </Link>

      <div className="product-detail-grid">
        <div className="product-detail-image">
          <div className="product-image-placeholder large">
            <span>{product.name.charAt(0)}</span>
          </div>
          {product.badge && <span className="detail-badge">{product.badge}</span>}
        </div>

        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <p className="detail-category">{product.category_name}</p>

          <div className="detail-pricing">
            <span className="detail-price">&#8377;{product.price?.toLocaleString('en-IN')}</span>
            {product.mrp && product.mrp > product.price && (
              <>
                <span className="detail-mrp">&#8377;{product.mrp.toLocaleString('en-IN')}</span>
                <span className="detail-discount">{discount}% OFF</span>
              </>
            )}
          </div>

          <p className="detail-description">{product.description}</p>

          <ul className="detail-features">
            <li><FaCheckCircle /> 15 Days Return Policy</li>
            <li><FaCheckCircle /> Delivery in 2 Days</li>
            <li><FaCheckCircle /> Bulk Wholesale Available</li>
            <li><FaCheckCircle /> GST Invoice Provided</li>
          </ul>

          {/* Quantity Selector */}
          <div className="qty-selector">
            <span>Quantity:</span>
            <div className="qty-control">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>
                <FaMinus />
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)}>
                <FaPlus />
              </button>
            </div>
          </div>

          <div className="detail-actions">
            <button
              className={`btn btn-buy btn-lg ${added ? 'btn-added' : ''}`}
              onClick={handleAddToCart}
            >
              {added ? <><FaCheck /> Added to Cart!</> : <><FaShoppingCart /> Add to Cart</>}
            </button>
            <button className="btn btn-buy-now btn-lg" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>

          <div className="detail-contact-actions">
            <a href="tel:+917004383597" className="btn btn-call btn-lg">
              <FaPhone /> Call Now
            </a>
            <a
              href={`https://wa.me/917004383597?text=Hi, I'm interested in ${encodeURIComponent(product.name)} (₹${product.price})`}
              className="btn btn-whatsapp btn-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
