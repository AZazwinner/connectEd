// src/sections/HowItWorks.tsx
import React from 'react';
import './HowItWorks.css';

const HowItWorks: React.FC = () => {
  return (
    <section className="how-it-works-section" id="how-it-works">
      {/* 
        This is the main content wrapper. It has a max-width and is centered.
        This is the key to keeping the text and image "stuck together".
      */}
      <div className="hiw-content-wrapper">

        {/* Column 1: Text Content */}
        <div className="hiw-text-content">
          <h2 className="hiw-heading">Learn Anywhere,<br/>Anytime. Offline.</h2>
          <p className="hiw-paragraph">
            Sync once, then access all lessons and challenges offline or online—flexible learning that fits your world.
          </p>
        </div>

        {/* Column 2: Image Content */}
        <div className="hiw-image-content">
          {/* The background image will be applied via CSS */}
        </div>
        
      </div>
    </section>
  );
};

export default HowItWorks;