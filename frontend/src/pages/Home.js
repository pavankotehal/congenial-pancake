import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
// Import the image directly
import heroImage from '../assets/images/hero-bg.jpg';

function Home() {
  const heroStyle = {
    background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
                 url(${heroImage})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <div className="home-container">
      <div className="hero-section" style={heroStyle}>
        <h1>MAISON NOIR</h1>
        <p className="tagline">Elevate Your Style, Step by Step</p>
        <Link to="/products" className="cta-button">
          Explore Collection
        </Link>
      </div>
      
      <div className="features-section">
        <div className="feature">
          <h3>Luxury Craftsmanship</h3>
          <p>Meticulously crafted footwear using the finest materials</p>
        </div>
        <div className="feature">
          <h3>Timeless Design</h3>
          <p>Classic aesthetics meet contemporary innovation</p>
        </div>
        <div className="feature">
          <h3>Exclusive Collection</h3>
          <p>Limited edition pieces for the discerning collector</p>
        </div>
      </div>
    </div>
  );
}

export default Home; 