import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Loader from './components/Loader/Loader';
import CustomCursor from './components/CustomCursor/CustomCursor';
import Navigation from './components/Navigation/Navigation';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Education from './components/Education/Education';
import Skills from './components/Skills/Skills';
import Projects from './components/Projects/Projects';
import Research from './components/Research/Research';
import Achievements from './components/Achievements/Achievements';
import Contact from './components/Contact/Contact';
import IRIS from './components/IRIS/IRIS';
import Footer from './components/Footer/Footer';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate minimum loading time for the premium feel
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <Loader key="loader" />}
      </AnimatePresence>

      {!isLoading && (
        <>
          <CustomCursor />
          <div className="cyber-bg-grid" aria-hidden="true" />
          <div className="cyber-glow-orb cyber-glow-1" aria-hidden="true" />
          <div className="cyber-glow-orb cyber-glow-2" aria-hidden="true" />
          <Navigation />
          
          <main>
            <Hero />
            <About />
            <Education />
            <Skills />
            <Projects />
            <Research />
            <Achievements />
            <Contact />
          </main>

          <Footer />
          <IRIS />
        </>
      )}
    </>
  );
}

export default App;
