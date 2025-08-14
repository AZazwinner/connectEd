import React from 'react'; // Removed useEffect and useRef, as they are no longer needed
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero: React.FC = () => {

  // This function handles the smooth scrolling for the "Learn More" button
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (!href) return;
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // --- NEW, SIMPLIFIED EVENT HANDLER ---
  // This single function will be attached directly to both buttons.
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty('--mouse-x', `${x}px`);
    target.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <section className="hero-section" id="hero">
      <div className="hero-content">
        <div className="fade-in-up">
            <h1 className="hero-heading">
            Quality Education, 
            <br/>
            designed to work <span className="text-emphasis">offline</span> & <span className="text-emphasis">online</span>.
            </h1>
        </div>

        <div className="fade-in-up">
            <p className="hero-subtitle">
                Learn anytime, anywhere — bridging gaps with flexible access.
            </p>
        </div>

        <div className="fade-in-up">
            <div className="hero-button-group">
                {/* --- FIX is applied here --- */}
                <Link 
                  to="/dashboard" 
                  className="hero-button primary"
                  onMouseMove={handleMouseMove} // We add the event handler directly
                >
                    <span>Get Started</span>
                </Link>
                
                {/* --- FIX is also applied here for consistency --- */}
                <a 
                  href="#how-it-works" 
                  className="hero-button" 
                  onClick={handleScroll}
                  onMouseMove={handleMouseMove} // We add the event handler directly
                >
                    <span>Learn More</span>
                </a>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;