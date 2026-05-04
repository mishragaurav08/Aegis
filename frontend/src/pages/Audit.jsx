import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5050';

const Audit = () => {
  const [logs, setLogs] = useState([]);
  const [risks, setRisks] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [logsRes, risksRes, assetsRes] = await Promise.all([
        axios.get(`${API_URL}/assets/logs`),
        axios.get(`${API_URL}/risks`),
        axios.get(`${API_URL}/assets`)
      ]);
      setLogs(logsRes.data);
      setRisks(risksRes.data);
      setAssets(assetsRes.data);
    } catch (error) {
      console.error('Audit Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getAuditSuggestions = () => {
    const suggestions = [];
    const highRisks = risks.filter(r => r.riskScore >= 15);
    const criticalAssets = assets.filter(a => (a.confidentiality + a.integrity + a.availability) >= 12);
    
    if (highRisks.length > 0) {
      suggestions.push({
        type: 'URGENT ATTENTION',
        msg: `${highRisks.length} systems have serious risks. They should be fixed immediately.`,
        priority: 'High'
      });
    }

    if (criticalAssets.length > risks.length) {
      suggestions.push({
        type: 'MISSING CHECKS',
        msg: `Found ${criticalAssets.length - risks.length} important systems that haven't been checked for risks yet.`,
        priority: 'Medium'
      });
    }

    if (assets.length > 0 && logs.length < 5) {
      suggestions.push({
        type: 'SECURITY LOGS',
        msg: "There aren't many activity logs. Try to record more changes for better tracking.",
        priority: 'Low'
      });
    }

    return suggestions;
  };

  const getActionColor = (action) => {
    const act = String(action).toUpperCase();
    if (act.includes('CREATE') || act.includes('ADDED')) return 'text-[#39FF14] bg-[#39FF14]/10';
    if (act.includes('DELETE') || act.includes('REMOVED')) return 'text-[#FF3131] bg-[#FF3131]/10';
    return 'text-[#00F2FF] bg-[#00F2FF]/10';
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-4 overflow-hidden animate-slide-up">
      <div className="flex justify-between items-center border-b border-border pb-2 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-primary uppercase tracking-widest m-0 font-orbitron">Activity History</h2>
          <p className="text-[10px] text-accent uppercase tracking-widest font-bold">Review system changes and suggestions</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 flex flex-col h-full min-h-0">
          <div className="panel-3d p-4 h-full flex flex-col min-h-0">
            <div className="flex justify-between items-center border-b border-border pb-2 mb-4">
              <h3 className="text-[11px] font-bold text-primary uppercase tracking-widest">Recent System Changes</h3>
              <button onClick={fetchData} className="text-[9px] text-accent hover:text-primary tracking-widest font-bold">REFRESH LOGS</button>
            </div>
            
            <div className="flex-1 overflow-auto custom-scrollbar space-y-2">
              {loading ? (
                <p className="text-[10px] text-slate-500 animate-pulse">Loading history...</p>
              ) : logs.length === 0 ? (
                <p className="text-[10px] text-slate-500 italic">No activity recorded yet.</p>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="bg-[#0B0E14] border border-border/50 p-3 flex justify-between items-center hover:border-primary/50 transition-colors group">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${getActionColor(log.action)}`}>
                          {log.action.includes(' ') ? 'ACTIVITY' : log.action}
                        </span>
                        <span className="text-[11px] text-[#F1F5F9] font-bold">
                          {log.details || log.action}
                        </span>
                      </div>
                      <span className="text-[8px] text-slate-500 uppercase tracking-widest">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] text-slate-600 font-mono">REC_{log.id.toString().padStart(4,'0')}</p>
                      <p className="text-[9px] text-[#00F2FF] font-bold opacity-0 group-hover:opacity-100 transition-opacity tracking-widest">SAVED</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="xl:col-span-1 flex flex-col gap-4 overflow-y-auto pr-1 custom-scrollbar">
          <div className="panel-3d p-4 shrink-0">
            <h3 className="text-[11px] font-bold text-primary mb-4 uppercase tracking-widest border-b border-border pb-1">Safety Suggestions</h3>
            <div className="space-y-4">
              {getAuditSuggestions().map((s, i) => (
                <div key={i} className={`p-3 border-l-4 ${
                  s.priority === 'High' ? 'border-[#FF3131] bg-[#FF3131]/10' : 
                  s.priority === 'Medium' ? 'border-[#FFD700] bg-[#FFD700]/10' : 'border-[#00F2FF] bg-[#00F2FF]/10'
                }`}>
                  <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${
                    s.priority === 'High' ? 'text-[#FF3131]' : s.priority === 'Medium' ? 'text-[#FFD700]' : 'text-[#00F2FF]'
                  }`}>{s.type}</p>
                  <p className="text-[10px] text-[#F1F5F9] font-mono leading-tight">{s.msg}</p>
                </div>
              ))}
              {getAuditSuggestions().length === 0 && (
                <p className="text-[10px] text-[#39FF14] italic">All checks complete. Everything looks good.</p>
              )}
            </div>
          </div>

          <div className="panel-3d p-4 shrink-0 bg-[#0B0E14]">
            <h3 className="text-[11px] font-bold text-accent mb-4 uppercase tracking-widest border-b border-border pb-1">Security Checklist</h3>
            <div className="space-y-3">
              {[
                { label: "Check User Access", status: "Active" },
                { label: "Verify Data Safety", status: "Pending" },
                { label: "Review Vendor Security", status: "Overdue" }
              ].map((policy, i) => (
                <div key={i} className="flex justify-between items-center border-b border-border/20 pb-2">
                  <span className="text-[10px] text-slate-300">{policy.label}</span>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                    policy.status === 'Active' ? 'text-[#39FF14] bg-[#39FF14]/20' : 
                    policy.status === 'Pending' ? 'text-[#FFD700] bg-[#FFD700]/20' : 'text-[#FF3131] bg-[#FF3131]/20'
                  }`}>
                    {policy.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Audit;
