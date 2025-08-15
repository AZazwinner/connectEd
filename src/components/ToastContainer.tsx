import React, { useState, useEffect } from 'react';
import AchievementToast from './AchievementToast';
import type { Achievement } from '../lib/achievements';
import { SHOW_ACHIEVEMENT_TOAST_EVENT } from '../lib/toastManager';

const TOAST_DURATION = 5000; // 5 seconds per toast

const ToastContainer: React.FC = () => {
  // --- THIS IS THE NEW STATE LOGIC ---
  const [queue, setQueue] = useState<Achievement[]>([]);
  const [activeToast, setActiveToast] = useState<Achievement | null>(null);

  // This effect listens for new toast requests from anywhere in the app
  useEffect(() => {
    const handleShowToast = (event: Event) => {
      const customEvent = event as CustomEvent<{ achievement: Achievement }>;
      const { achievement } = customEvent.detail;
      
      // Instead of showing the toast immediately, we add it to our waiting queue.
      setQueue(currentQueue => [...currentQueue, achievement]);
    };

    window.addEventListener(SHOW_ACHIEVEMENT_TOAST_EVENT, handleShowToast);
    return () => {
      window.removeEventListener(SHOW_ACHIEVEMENT_TOAST_EVENT, handleShowToast);
    };
  }, []); // Set up the listener only once

  // --- This is the new "Queue Manager" effect ---
  // This effect watches the queue and decides when to show the next toast.
  useEffect(() => {
    // If there is already a toast on screen, or if the queue is empty, do nothing.
    if (activeToast || queue.length === 0) {
      return;
    }

    // Take the next toast from the queue
    const [nextToast, ...remainingQueue] = queue;
    
    // Show it and update the queue
    setActiveToast(nextToast);
    setQueue(remainingQueue);

    // Set a timer to automatically hide this toast after its duration
    const timer = setTimeout(() => {
      setActiveToast(null); // Hide the current toast
    }, TOAST_DURATION);

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);

  }, [queue, activeToast]); // This effect re-runs whenever the queue or active toast changes

  // This function handles a manual close (clicking the 'x' button)
  const handleClose = () => {
    setActiveToast(null);
  };

  return (
    <div className="toast-wrapper">
      {/* We only ever render the single 'activeToast' */}
      {activeToast && (
        <AchievementToast 
          key={activeToast.id} // Using a stable key is better
          achievement={activeToast} 
          onClose={handleClose} 
        />
      )}
    </div>
  );
};

export default ToastContainer;