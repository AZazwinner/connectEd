// src/pages/Dashboard.tsx

import React, { useEffect } from 'react';
import LearningPath from '../components/LearningPath';
import { dashboardData } from '../dashboardData';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  useEffect(() => {
    // When the dashboard loads, add the class to the body
    document.body.classList.add('dashboard-bg');

    // When the component is unmounted (e.g., user navigates away),
    // clean up by removing the class.
    return () => {
      document.body.classList.remove('dashboard-bg');
    };
  }, []);
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Learning Paths</h1>
        <p>Choose a category and start your journey.</p>
      </header>
      <main className="dashboard-main">
        {dashboardData.map(path => (
          <LearningPath key={path.id} path={path} />
        ))}
      </main>
    </div>
  );
};

export default Dashboard;