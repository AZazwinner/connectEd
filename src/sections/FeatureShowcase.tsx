// src/sections/FeatureShowcase.tsx
import React from 'react';
import './FeatureShowcase.css';

const FeatureShowcase: React.FC = () => {
  return (
    <section className="feature-showcase-section" id="features">
      <h2 className="section-title">An Ecosystem of Discovery</h2>
      <div className="features-container">
        <div className="feature-card">
          <div className="feature-visual wiki"></div>
          <h3>The Encyclopedia</h3>
          <p>On-demand, cached access to any Wikipedia article for research and reading. [4]</p>
        </div>
        <div className="feature-card">
          <div className="feature-visual nasa"></div>
          <h3>The Observatory</h3>
          <p>Breathtaking space content from NASA's own real-time APIs to inspire interest in STEM. [4]</p>
        </div>
        <div className="feature-card">
          <div className="feature-visual trivia"></div>
          <h3>The Challenge Zone</h3>
          <p>A fun and engaging trivia game with multiple categories to test general knowledge. [4]</p>
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;