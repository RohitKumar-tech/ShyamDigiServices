import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';
import CategoryBanner from '../components/CategoryBanner';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

const API = process.env.REACT_APP_API_URL || '';

function HomePage() {
  const [sections, setSections] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    setLoading(true);
    if (searchQuery) {
      fetch(`${API}/api/products?search=${encodeURIComponent(searchQuery)}`)
        .then(r => r.json())
        .then(data => {
          setSearchResults(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      fetch(`${API}/api/homepage`)
        .then(r => r.json())
        .then(data => {
          setSections(data);
          setSearchResults(null);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (searchQuery && searchResults) {
    return (
      <div className="container search-results-page">
        <h2>Search Results for "{searchQuery}"</h2>
        {searchResults.length === 0 ? (
          <p className="no-results">No products found. Try a different search term.</p>
        ) : (
          <div className="products-grid">
            {searchResults.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <HeroBanner />
      <CategoryBanner />

      {sections.map(section => (
        section.products.length > 0 && (
          <section key={section.id} className="product-section">
            <div className="container">
              <div className="section-header">
                <h2>{section.name}</h2>
                <Link to={`/category/${section.slug}`} className="view-all">
                  View All &rarr;
                </Link>
              </div>
              <p className="section-desc">{section.description}</p>
              <div className="products-grid">
                {section.products.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )
      ))}
    </>
  );
}

export default HomePage;
