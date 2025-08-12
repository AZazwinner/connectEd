// src/sections/Hero.tsx
import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero-section" id="hero">
      <div className="hero-content">
        <h1>Quality education, designed to work offline and online.</h1>
        <p>Learn anytime, anywhere — bridging gaps with flexible access.</p>
        {/* This button will scroll the page to the section with the id="how-it-works" */}
        <a href="#how-it-works" className="hero-cta-button">See How It Works</a>
      </div>
    </section>
  );
};

export default Hero;