// Modal.tsx

import React from 'react';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode; // Main content goes here
  footer?: React.ReactNode; // Optional footer for action buttons
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) {
    return null;
  }

  // This stops a click inside the window from closing it
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    // The semi-transparent backdrop
    <div className="modal-backdrop" onClick={onClose}>
      
      {/* The main window content */}
      <div className="modal-content" onClick={handleContentClick}>
        
        <header className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </header>

        <main className="modal-body">
          {children}
        </main>

        {footer && (
          <footer className="modal-footer">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
};

export default Modal;