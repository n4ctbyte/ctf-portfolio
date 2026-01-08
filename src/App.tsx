import { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import SubjectProfile from './components/SubjectProfile';
import Capabilities from './components/Capabilities';
import EvidenceLogs from './components/EvidenceLogs';
import Contact from './components/Contact';
import Footer from './components/Footer';
import TacticalAssistant from './components/TacticalAssistant';
import ScanlineOverlay from './components/ScanlineOverlay';
import BootSequence from './components/BootSequence';

function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [capturedKeys, setCapturedKeys] = useState('');

  useEffect(() => {
    console.log('%c⚠ SYSTEM LOG: Unauthorized inspector detected. Welcome, Analyst.',
      'background: #0D0D0D; color: #00FF41; font-size: 14px; padding: 10px; font-family: monospace; border: 1px solid #333333;');

    console.log('%c[ENCODED_MSG]: VGhlIGJlc3Qgd2F5IHRvIHByZWRpY3QgdGhlIGZ1dHVyZSBpcyB0byBpbnZlbnQgaXQ=',
      'color: #666666; font-family: monospace; font-size: 12px;');

    console.log('%c[HEX]: 546865206f6e6c792077617920746f20646f2067726561742077b726b206973206c6f766520776861742070796f7520646f',
      'color: #666666; font-family: monospace; font-size: 12px;');
  }, []);

  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const newKeys = (capturedKeys + e.key).slice(-7);
      setCapturedKeys(newKeys);

      if (newKeys === 'capture' || newKeys.includes('root') || newKeys.includes('flag')) {
        triggerSecretEffect(newKeys);
        setCapturedKeys('');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [capturedKeys]);

  const triggerSecretEffect = (keyword: string) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: #00FF41;
      opacity: 0.3;
      z-index: 9999;
      pointer-events: none;
      animation: pulse 0.5s ease-out;
    `;
    document.body.appendChild(overlay);

    console.log(`%c[ACCESS_GRANTED]: Keyword "${keyword}" detected. Clearance level elevated.`,
      'background: #00FF41; color: #0D0D0D; font-weight: bold; padding: 5px; font-family: monospace;');

    setTimeout(() => overlay.remove(), 500);
  };

  if (isBooting) {
    return <BootSequence onComplete={() => setIsBooting(false)} />;
  }

  return (
    <div className="relative bg-[#0D0D0D] text-[#E0E0E0] min-h-screen font-sans">
      <ScanlineOverlay />
      <Navigation />
      <Hero />
      <SubjectProfile />
      <Capabilities />
      <EvidenceLogs />
      <Contact />
      <Footer />
      <TacticalAssistant />
    </div>
  );
}

export default App;
