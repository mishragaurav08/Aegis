import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5050';

const Audit = () => {
  const [logs, setLogs] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(`${API_URL}/audit`);
        setLogs(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLogs();
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-4 overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-border pb-2 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-primary uppercase tracking-widest m-0 font-orbitron">System Activity</h2>
          <p className="text-[10px] text-accent uppercase tracking-widest font-bold">Reviewing Past Events // {currentTime}</p>
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 min-h-0">
        <div className="panel-3d p-4 h-full flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-4 border-b border-border pb-1">
            <h3 className="text-[11px] font-bold text-primary uppercase tracking-widest">Recent Event List</h3>
          </div>
          
          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left text-[10px] border-collapse font-mono">
              <thead className="sticky top-0 bg-surface z-10">
                <tr className="border-b border-border text-accent uppercase tracking-widest">
                  <th className="p-2 w-20">Log ID</th>
                  <th className="p-2">What Happened?</th>
                  <th className="p-2 text-right">Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {[...logs].reverse().map((log) => (
                  <tr key={log.id} className="border-b border-border/10 hover:bg-white/5 transition-colors">
                    <td className="p-2 text-accent font-bold">#{String(log.id).padStart(4, '0')}</td>
                    <td className="p-2 text-text">&gt; {log.action}</td>
                    <td className="p-2 text-right text-text opacity-60 font-mono">
                      {new Date(log.timestamp).toLocaleDateString()} // {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Audit;
