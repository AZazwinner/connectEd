// src/sections/Philosophy.tsx
import React from 'react';
import './Philosophy.css';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'; // Import our hook

const Philosophy: React.FC = () => {
  // Use the hook to watch the main section element
  const [sectionRef, isSectionVisible] = useIntersectionObserver<HTMLElement>();

  return (
    // Attach the ref to the section
    <section className="philosophy-section" id="philosophy" ref={sectionRef}>
      <div className="philosophy-content">
        {/* Conditionally apply the animation class to the title */}
        <h2 className={`section-title ${isSectionVisible ? 'animated-item' : ''}`} style={{color: '#3b4862'}}>
          Two Paths to Brilliance
        </h2>
        
        <div className="paths-container">
            {/* Conditionally apply the animation class to the first card */}
            <div className={`path-card ${isSectionVisible ? 'animated-item' : ''}`}>
                <div className="card-text-content">
                    <h3>Build the Foundation</h3>
                    <p>Get confident in math with our well-designed Core Curriculum. Covering over 40 skills across 10 levels, it gives you a clear path to success, plus quizzes that adapt to keep you practicing and improving.</p>
                </div>
            </div>
            {/* Conditionally apply the animation class to the second card */}
            <div className={`path-card ${isSectionVisible ? 'animated-item' : ''}`}>
                <div className="card-text-content">
                    <h3>Explore the Frontier</h3>
                    <p>Feed your curiosity with a huge offline library of knowledge, explore the wonders of space with real data, and challenge yourself with fun trivia games that keep your brain sharp.</p>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;