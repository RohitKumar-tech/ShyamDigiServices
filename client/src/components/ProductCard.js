import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPhone, FaShoppingCart, FaCheck } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const discount = product.mrp
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="product-card">
      {product.badge && <span className="product-badge">{product.badge}</span>}
      {discount > 0 && <span className="product-discount">-{discount}%</span>}

      <Link to={`/product/${product.slug}`} className="product-image-wrap">
        <div className="product-image-placeholder">
          <span>{product.name.charAt(0)}</span>
        </div>
      </Link>

      <div className="product-info">
        <Link to={`/product/${product.slug}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>

        <div className="product-pricing">
          <span className="product-price">&#8377;{product.price?.toLocaleString('en-IN')}</span>
          {product.mrp && product.mrp > product.price && (
            <span className="product-mrp">&#8377;{product.mrp.toLocaleString('en-IN')}</span>
          )}
        </div>

        <div className="product-actions">
          <a href="tel:+917004383597" className="btn btn-call">
            <FaPhone /> Call
          </a>
          <button
            className={`btn btn-buy ${added ? 'btn-added' : ''}`}
            onClick={handleAddToCart}
          >
            {added ? <><FaCheck /> Added!</> : <><FaShoppingCart /> Add to Cart</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
