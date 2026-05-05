import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import Risks from './pages/Risks';
import Audit from './pages/Audit';
import { audioManager } from './utils/audio';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  useEffect(() => {
    const handleGlobalClick = (e) => {
      const isInteractive = e.target.closest('button') || e.target.closest('a') || (e.target.tagName === 'INPUT' && e.target.type === 'submit');
      if (isInteractive) {
        audioManager.playClick();
      }
    };

    const handleGlobalHover = (e) => {
      const isInteractive = e.target.closest('button') || e.target.closest('a');
      if (isInteractive) {
        audioManager.playHover();
      }
    };

    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('mouseover', handleGlobalHover);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('mouseover', handleGlobalHover);
    };
  }, []);

  useEffect(() => {
    audioManager.playTransition();
  }, [activePage]);

  const renderPage = () => {

    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'assets': return <Assets />;
      case 'risks': return <Risks />;
      case 'audit': return <Audit />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout setActivePage={setActivePage} activePage={activePage}>
      {renderPage()}
    </Layout>
  );
}

export default App;

