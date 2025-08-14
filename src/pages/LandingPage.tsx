// src/App.tsx

// Import all the static sections
import Hero from '../sections/Hero';
import HowItWorks from '../sections/HowItWorks';
import Philosophy from '../sections/Philosophy';
import Mission from '../sections/Mission';
import CallToAction from '../sections/CallToAction';

function App() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Philosophy />
      <Mission />
      <CallToAction />
    </main>
  );
}

export default App;