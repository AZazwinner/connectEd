// src/App.tsx

// Import all the static sections
import Hero from './sections/Hero';
import HowItWorks from './sections/HowItWorks.tsx';
import Philosophy from './sections/Philosophy.tsx';
import FeatureShowcase from './sections/FeatureShowcase.tsx';
import CallToAction from './sections/CallToAction.tsx';

// Global styles
import './App.css';

function App() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Philosophy />
      <FeatureShowcase />
      <CallToAction />
    </main>
  );
}

export default App;