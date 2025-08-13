// src/sections/Mission.tsx
import React from 'react';
import './Mission.css';
import missionImageUrl from '/ourmission.png';

const Mission: React.FC = () => {
  return (
    <section className="mission-section" id="mission">
      {/* 
        This is the main wrapper, just like in HowItWorks. 
        It has a max-width and keeps the two columns stuck together.
      */}
      <div className="mission-wrapper">

        <div className="mission-image-container">
          <img src={missionImageUrl} alt="Children in an outdoor classroom setting" />
        </div>
        
        {/* Column 2: Text (on the right) */}
        <div className="mission-text-content">
          <h2 className="mission-heading">Our Mission</h2>
          <p className="mission-paragraph">
            To bridge the educational divide by leveraging technology that makes learning accessible to underprivileged communities. We are committed to providing free, high-quality, and interactive tools that empower students and educators, even in low-connectivity areas, helping them to overcome barriers and unlock their full potential.
          </p>
        </div>

      </div>
    </section>
  );
};

export default Mission;