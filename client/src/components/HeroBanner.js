import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HeroBanner.css';

const slides = [
  {
    title: 'Wide Range of ONT Routers',
    subtitle: 'Single Band, Dual Band & Fiber Testing Equipment',
    cta: 'Shop Now',
    link: '/category/ont-routers',
    bg: 'linear-gradient(135deg, #b71c1c 0%, #880e4f 100%)',
  },
  {
    title: 'Best Service on ONTs',
    subtitle: 'FTTH Distributor - Wholesale Pricing for ISPs',
    cta: 'View Products',
    link: '/category/sfp-modules',
    bg: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
  },
  {
    title: 'Splicing Machines & Tools',
    subtitle: 'Fujikura, Uniway & More at Lowest Rates',
    cta: 'Explore',
    link: '/category/splicing-machines',
    bg: 'linear-gradient(135deg, #004d40 0%, #00695c 100%)',
  },
];

function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-banner" style={{ background: slides[current].bg }}>
      <div className="container hero-content">
        <h1>{slides[current].title}</h1>
        <p>{slides[current].subtitle}</p>
        <Link to={slides[current].link} className="hero-cta">
          {slides[current].cta}
        </Link>
      </div>
      <div className="hero-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero-dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroBanner;
