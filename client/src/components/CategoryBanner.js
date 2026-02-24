import React from 'react';
import { Link } from 'react-router-dom';
import { FaWifi, FaSatelliteDish, FaTools, FaNetworkWired } from 'react-icons/fa';
import './CategoryBanner.css';

const featuredCategories = [
  { name: 'ONT Router', slug: 'ont-routers', desc: 'Single Band & Dual Band at Low Cost', icon: FaWifi },
  { name: 'SFP Modules', slug: 'sfp-modules', desc: '9 DBM Pon SFP & Uplink/Downlink', icon: FaSatelliteDish },
  { name: 'Fiber Testing', slug: 'fiber-testing', desc: 'Cleaver, Stripper, Power Metre & OTDR', icon: FaTools },
  { name: 'Fiber Extensions', slug: 'fiber-extensions', desc: 'Fiber Connectivity Products', icon: FaNetworkWired },
];

function CategoryBanner() {
  return (
    <section className="category-banner">
      <div className="container">
        <div className="category-banner-header">
          <span className="isp-badge">Only for ISP</span>
          <h2>We Deal Only in High Quality FTTH Products</h2>
        </div>
        <div className="category-banner-grid">
          {featuredCategories.map((cat) => (
            <Link to={`/category/${cat.slug}`} key={cat.slug} className="category-card">
              <cat.icon className="category-icon" />
              <h3>{cat.name}</h3>
              <p>{cat.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoryBanner;
