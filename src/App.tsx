import { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import SubjectProfile from './components/SubjectProfile';
import Capabilities from './components/Mandate';
import EvidenceLogs from './components/EvidenceLogs';
import Contact from './components/Contact';
import Footer from './components/Footer';
import TacticalAssistant from './components/TacticalAssistant';
import ScanlineOverlay from './components/ScanlineOverlay';
import BootSequence from './components/BootSequence';

function App() {
  const [showBoot, setShowBoot] = useState(true);
  const [keyBuffer, setKeyBuffer] = useState('');
  const [showAccessGranted, setShowAccessGranted] = useState(false);

  useEffect(() => {
    console.log(
      '%c[SYSTEM_INIT] Access granted to secure archive',
      'color: #00FF41; font-family: monospace; font-size: 14px;'
    );
    console.log(
      'aHR0cHM6Ly95b3V0dS5iZS9oUHItWWM5MnFhWT9zaT1PNE5VWldoTV80NDQ2eVlS',
      'color: #666; font-family: monospace;'
    );
    console.log(
      'c4e414b4154415f434852495354494e414e',
      'color: #00FF41; font-family: monospace; font-weight: bold;'
    );
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const newBuffer = (keyBuffer + e.key.toLowerCase()).slice(-10);
      setKeyBuffer(newBuffer);

      const ctfKeywords = ['toor', 'flag', 'capture', 'root', 'hack', 'ctf', 'pwn', 'exploit'];
      const hasMatch = ctfKeywords.some(keyword => newBuffer.includes(keyword));

      if (hasMatch) {
        setShowAccessGranted(true);
        console.log(
          '%c[SECURITY_ALERT] Easter egg triggered! Access sequence detected.',
          'color: #00FF41; font-family: monospace; font-size: 16px; font-weight: bold;'
        );
        setTimeout(() => setShowAccessGranted(false), 2000);
        setKeyBuffer('');
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [keyBuffer]);

  return (
    <>
      {showBoot && <BootSequence onComplete={() => setShowBoot(false)} />}

      {showAccessGranted && (
        <div className="fixed inset-0 z-[9998] pointer-events-none flex items-center justify-center access-granted-overlay">
          <div className="text-[#00FF41] text-6xl font-mono font-bold animate-pulse">
            [ ACCESS GRANTED ]
          </div>
        </div>
      )}

      <div className="min-h-screen bg-[#0D0D0D] text-[#E0E0E0]">
        <ScanlineOverlay />
        <Navigation />
        <Hero />
        <SubjectProfile />
        <Capabilities />
        <EvidenceLogs />
        <Contact />
        <TacticalAssistant />
      </div>
    </>
  );
}

export default App;
