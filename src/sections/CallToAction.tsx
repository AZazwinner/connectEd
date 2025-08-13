// src/sections/CallToAction.tsx
import React from 'react';
import './CallToAction.css';

const CallToAction: React.FC = () => {
  return (
    <section className="cta-section" id="cta">
        <h2>Help Us Bridge the Gap.</h2>
        <p>ConnectEd Classroom is a fully functional, offline-first PWA directly supporting UN Sustainable Development Goal 4 by delivering inclusive and equitable education to those who need it most.</p>
        <div className="cta-buttons">
            <a 
                href="https://github.com/AZazwinner/connectEd"
                target="_blank" 
                rel="noopener noreferrer"
                className="cta-button shrink-border"
            >
                <span className="button-text">View on GitHub</span>
            </a>
        </div>

        <div className="tech-footer">
            <p>
            Built with <span className="tech-keyword python">Python</span>, <span className="tech-keyword react">React</span>, <span className="tech-keyword typescript">TypeScript</span>, and a touch of magic in <span className="tech-keyword vscode">VS Code</span>.
            </p>
        </div>
    </section>
  );
};

export default CallToAction;