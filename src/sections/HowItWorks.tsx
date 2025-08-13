// src/sections/HowItWorks.tsx
import React from 'react';
import './HowItWorks.css';
import howItWorksUrl from '/HowItWorks.png';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'; // Import the hook

const HowItWorks: React.FC = () => {
  // This part is perfect. You are correctly getting the ref and the visibility state.
  const [sectionRef, isSectionVisible] = useIntersectionObserver<HTMLElement>();

  return (
    // The ref is correctly attached here.
    <section className="how-it-works-section" ref={sectionRef} id="how-it-works">
      <div className="hiw-content-wrapper">

        {/* 
          THIS IS THE FIX:
          We use a template literal to build the className string.
          - The 'hiw-text-content' class is always there.
          - The 'animated-item' class is ONLY added if isSectionVisible is true.
        */}
        <div className={`hiw-text-content ${isSectionVisible ? 'animated-item' : ''}`}>
          <h2 className="hiw-heading">Learn Anywhere,<br/>Anytime. Offline.</h2>
          <p className="hiw-paragraph">
            Sync once, then access all lessons and challenges offline or online—flexible learning that fits your world.
          </p>
        </div>

        {/* Apply the same fix to the image container */}
        <div className={`hiw-image-container ${isSectionVisible ? 'animated-item' : ''}`}>
          <img src={howItWorksUrl} alt="A diagram showing a central hub syncing to devices" />
        </div>
        
      </div>
    </section>
  );
};

export default HowItWorks;