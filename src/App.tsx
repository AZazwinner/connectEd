// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard.tsx';
import LevelDetailPage from './pages/LevelDetailPage';
import WorkspacePage from './pages/WorkspacePage';
import PlacementTestPage from './pages/PlacementTestPage';
import TriviaPage from './pages/TriviaPage'; // <-- 1. Import new page
import TriviaWorkspace from './pages/TriviaWorkspace';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/math/:levelId" element={<LevelDetailPage />} />
      <Route path="/workspace/:levelId/:skillId" element={<WorkspacePage />} />
      <Route path="/placement-test/:targetLevelId" element={<PlacementTestPage />} />
      <Route path="/trivia" element={<TriviaPage />} />
      <Route path="/trivia/workspace" element={<TriviaWorkspace />} />
    </Routes>
  );
}

export default App;