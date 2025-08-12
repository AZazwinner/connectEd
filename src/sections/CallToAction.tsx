// src/sections/CallToAction.tsx
import React from 'react';
import './CallToAction.css';

const CallToAction: React.FC = () => {
  return (
    <section className="cta-section" id="cta">
      <h2>Help Us Bridge the Gap.</h2>
      <p>ConnectEd Classroom is a fully functional, offline-first PWA directly supporting UN Sustainable Development Goal 4 by delivering inclusive and equitable education to those who need it most.</p>
      <div className="cta-buttons">
        <a href="#" className="cta-button">View on GitHub</a>
        {/* You can add this button if you have a live demo */}
        {/* <a href="#" className="cta-button">Try the Demo</a> */}
      </div>
    </section>
  );
};

export default CallToAction;