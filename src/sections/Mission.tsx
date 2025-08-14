// src/sections/Mission.tsx
import React from 'react';
import './Mission.css';
import missionImageUrl from '/ourmission.png';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'; // Import the hook

const Mission: React.FC = () => {
  // Use the hook to watch the main section
  const [sectionRef, isSectionVisible] = useIntersectionObserver<HTMLElement>();

  return (
    // Attach the ref to the section element
    <section className="mission-section" id="mission" ref={sectionRef}>
      <div className="mission-wrapper">

        {/* Conditionally apply the animation class */}
        <div className={`mission-image-container ${isSectionVisible ? 'animated-item' : ''}`}>
          <img src={missionImageUrl} alt="Children in an outdoor classroom setting" />
        </div>
        
        {/* Conditionally apply the animation class */}
        <div className={`mission-text-content ${isSectionVisible ? 'animated-item' : ''}`}>
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