// src/sections/Hero.tsx
import React, { useEffect, useRef } from 'react';
import './Hero.css';

const Hero: React.FC = () => {
  // Create refs for the buttons to attach event listeners directly
  const getStartedRef = useRef<HTMLAnchorElement>(null);
  const learnMoreRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const buttons = [getStartedRef.current, learnMoreRef.current];

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement;
      if (target) {
        const rect = target.getBoundingClientRect();
        // Calculate mouse position relative to the button
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Set CSS custom properties for the gradient position
        target.style.setProperty('--mouse-x', `${x}px`);
        target.style.setProperty('--mouse-y', `${y}px`);
      }
    };

    buttons.forEach(button => {
      if (button) {
        button.addEventListener('mousemove', handleMouseMove);
      }
    });

    // Cleanup function to remove event listeners
    return () => {
      buttons.forEach(button => {
        if (button) {
          button.removeEventListener('mousemove', handleMouseMove);
        }
      });
    };
  }, []); // Empty dependency array means this runs once on mount
  return (
    <section className="hero-section" id="hero">
      <div className="hero-content">
        <h1 className="hero-heading">
          Quality Education, 
          <br/>
          designed to work <span className="text-emphasis">offline</span> & <span className="text-emphasis">online</span>.
        </h1>
        
        <p className="hero-subtitle">
            Learn anytime, anywhere — bridging gaps with flexible access.
        </p>

        <div className="hero-button-group">
          <a href="#get-started" className="hero-button" ref={getStartedRef}>
            <span>Get Started</span>
          </a>
          <a href="#learn-more" className="hero-button" ref={learnMoreRef}>
            <span>Learn More</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;