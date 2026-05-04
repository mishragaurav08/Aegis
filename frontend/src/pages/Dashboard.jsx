import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import RiskMatrix from '../components/RiskMatrix';

ChartJS.register(ArcElement, Tooltip, Legend);

const API_URL = 'http://localhost:5050';

const Dashboard = () => {
  const [risks, setRisks] = useState([]);
  const [assets, setAssets] = useState([]);
  const [logs, setLogs] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [riskRes, assetRes, auditRes] = await Promise.all([
          axios.get(`${API_URL}/risks`),
          axios.get(`${API_URL}/assets`),
          axios.get(`${API_URL}/audit`)
        ]);
        setRisks(riskRes.data);
        setAssets(assetRes.data);
        setLogs(auditRes.data.slice(0, 15));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDownload = async () => {
    setLoading(true);
    try {
      // Simulate/Wait for PDF generation start
      window.location.href = `${API_URL}/report`;
      await new Promise(resolve => setTimeout(resolve, 2000));
    } finally {
      setLoading(false);
    }
  };

  const lowCount = risks.filter(r => r.level === 'Low').length;
  const mediumCount = risks.filter(r => r.level === 'Medium').length;
  const highCount = risks.filter(r => r.level === 'High').length;

  const data = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [
      {
        data: [lowCount, mediumCount, highCount],
        backgroundColor: ['#39FF14', '#FFAC1C', '#FF3131'],
        borderColor: '#151921',
        borderWidth: 2,
        hoverOffset: 10,
        cutout: '75%',
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#F1F5F9',
          padding: 10,
          font: { family: "'Share Tech Mono', monospace", size: 10 },
          boxWidth: 10
        }
      },
      tooltip: {
        backgroundColor: '#151921',
        titleFont: { family: "'Orbitron', sans-serif" },
        bodyFont: { family: "'Share Tech Mono', monospace" },
        padding: 8,
        borderColor: '#262B37',
        borderWidth: 1,
        displayColors: false
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-4 overflow-hidden animate-slide-up">
      
      {/* Compact Header */}
      <div className="flex justify-between items-center border-b border-border pb-2 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-primary uppercase tracking-widest m-0 font-orbitron">Security Overview</h2>
          <p className="text-[10px] text-accent uppercase tracking-widest font-bold flex items-center gap-2">
            System Online // {currentTime}
          </p>
        </div>
        <button 
          onClick={handleDownload}
          disabled={loading}
          className="bg-primary text-bg font-bold px-4 py-1.5 text-xs uppercase tracking-widest border border-primary hover:bg-bg hover:text-primary tech-btn disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'GENERATING...' : 'Download Report (PDF)'}
        </button>
      </div>
      
      {/* Compact Stats Grid */}
      <div className="grid grid-cols-4 gap-4 shrink-0">
        {[
          { label: 'Total Items', val: assets.length, color: 'border-primary', text: 'text-primary' },
          { label: 'Low Risks', val: lowCount, color: 'border-primary', text: 'text-primary' },
          { label: 'Medium Risks', val: mediumCount, color: 'border-warning', text: 'text-warning' },
          { label: 'High Risks', val: highCount, color: 'border-danger', text: 'text-danger' }
        ].map((stat, i) => (
          <div key={i} className={`panel-3d p-3 border-l-4 ${stat.color} flex flex-col justify-center`}>
            <h4 className="text-text uppercase tracking-widest text-[9px] opacity-50 leading-tight">{stat.label}</h4>
            <p className={`text-xl font-bold ${stat.text} font-orbitron leading-tight`}>{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-4 gap-4">
        
        {/* Left Column */}
        <div className="xl:col-span-1 flex flex-col gap-4 min-h-0">
          <div className="panel-3d p-4 flex-[1.5] flex flex-col min-h-0 relative">
            <h3 className="text-[11px] font-bold text-primary mb-2 uppercase tracking-widest border-b border-border pb-1">Risk Summary</h3>
            <div className="flex-1 relative min-h-0">
              {risks.length > 0 ? (
                <>
                  <Doughnut data={data} options={chartOptions} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                    <span className="text-[20px] font-bold text-text font-orbitron">{risks.length}</span>
                    <span className="text-[8px] text-text opacity-40 uppercase tracking-widest">Total</span>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center border border-dashed border-border/30">
                  <span className="text-[9px] uppercase tracking-widest">Awaiting Data</span>
                </div>
              )}
            </div>
          </div>

          <div className="panel-3d p-4 flex-1 flex flex-col min-h-0">
            <h3 className="text-[11px] font-bold text-primary uppercase tracking-widest border-b border-border mb-2 pb-1 shrink-0">Recent Activity</h3>
            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-2">
              {logs.map((log, idx) => (
                <div key={idx} className="flex flex-col border-b border-border/10 pb-1.5 last:border-0">
                  <span className="text-accent text-[8px] font-mono font-bold">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                  <span className="text-text text-[9px] font-mono leading-tight mt-0.5 truncate opacity-80">&gt; {log.action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="xl:col-span-3 min-h-0">
          <div className="panel-3d p-4 h-full overflow-hidden flex flex-col">
            <RiskMatrix />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
