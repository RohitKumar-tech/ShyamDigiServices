import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

const API = process.env.REACT_APP_API_URL || '';

function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API}/api/categories/${slug}`).then(r => r.json()),
      fetch(`${API}/api/products?category=${slug}`).then(r => r.json()),
    ])
      .then(([cat, prods]) => {
        setCategory(cat);
        setProducts(prods);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '30px 15px' }}>
      <div className="section-header" style={{ marginBottom: 6 }}>
        <h2>{category?.name || 'Category'}</h2>
      </div>
      <p className="section-desc">{category?.description}</p>

      {products.length === 0 ? (
        <p className="no-results">No products in this category yet.</p>
      ) : (
        <div className="products-grid">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}

export default CategoryPage;
