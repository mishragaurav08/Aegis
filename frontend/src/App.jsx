import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import Risks from './pages/Risks';
import Audit from './pages/Audit';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

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
