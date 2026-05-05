import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { audioManager } from '../utils/audio';


const API_URL = 'http://localhost:5050';

const Risks = () => {
  const [risks, setRisks] = useState([]);
  const [assets, setAssets] = useState([]);
  const [formData, setFormData] = useState({ 
    assetId: '', 
    threat: 'Data Theft / Leak', 
    vulnerability: '', 
    likelihood: 1, 
    impact: 1,
    treatment: 'Mitigate' 
  });
  const [liveRiskScore, setLiveRiskScore] = useState(1);
  const [liveRiskLevel, setLiveRiskLevel] = useState('Low');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [loading, setLoading] = useState(false);

  const fetchRisks = async () => {
    try {
      const res = await axios.get(`${API_URL}/risks`);
      setRisks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAssets = async () => {
    try {
      const res = await axios.get(`${API_URL}/assets`);
      setAssets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRisks();
    fetchAssets();
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const score = formData.likelihood * formData.impact;
    setLiveRiskScore(score);
    if (score >= 16) setLiveRiskLevel('High');
    else if (score >= 6) setLiveRiskLevel('Medium');
    else setLiveRiskLevel('Low');
  }, [formData.likelihood, formData.impact]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/risks`, formData);
      audioManager.playSuccess();
      setFormData({ assetId: '', threat: 'Data Theft / Leak', vulnerability: '', likelihood: 1, impact: 1, treatment: 'Mitigate' });
      await fetchRisks();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this risk entry?")) return;
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/risks/${id}`);
      audioManager.playAlert();
      await fetchRisks();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level) => {
    if (level === 'High') return 'text-[#FF3131]';
    if (level === 'Medium') return 'text-[#FFD700]';
    return 'text-[#39FF14]';
  };

  const inputClasses = "w-full bg-bg border-2 border-border p-2 text-[10px] text-text focus:border-primary outline-none transition-colors tech-select";
  const labelClasses = "text-[9px] text-accent uppercase tracking-widest font-bold mb-1 block";

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-4 overflow-hidden animate-slide-up">
      <div className="flex justify-between items-center border-b border-border pb-2 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-primary uppercase tracking-widest m-0 font-orbitron">Risk Analysis & Treatment</h2>
          <p className="text-[10px] text-accent uppercase tracking-widest font-bold">Data Collection & Asset Scoping // {currentTime}</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          <div className="panel-3d p-4 flex flex-col shrink-0">
            <h3 className="text-[11px] font-bold text-primary mb-4 uppercase tracking-widest border-b border-border pb-1">Identification & Assessment</h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 font-mono">
              <div>
                <label className={labelClasses}>Select Target System</label>
                <select name="assetId" value={formData.assetId} onChange={handleChange} disabled={loading} className={inputClasses} required>
                  <option value="">-- SYSTEM INVENTORY --</option>
                  {assets.map(asset => (
                    <option key={asset.id} value={asset.id}>{asset.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClasses}>Threat Source</label>
                  <select name="threat" value={formData.threat} onChange={handleChange} disabled={loading} className={inputClasses} required>
                    <option value="Data Theft / Leak">Data Theft</option>
                    <option value="Service Shutdown">Service Outage</option>
                    <option value="Credential Theft">Credential Theft</option>
                    <option value="Phishing">Phishing Attack</option>
                    <option value="Ransomware">Ransomware</option>
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Vulnerability</label>
                  <select name="vulnerability" value={formData.vulnerability} onChange={handleChange} disabled={loading} className={inputClasses} required>
                    <option value="">-- SELECT --</option>
                    <option value="Outdated Patch">Outdated Patch</option>
                    <option value="Weak Credentials">Weak Credentials</option>
                    <option value="Insecure Port">Insecure Port</option>
                    <option value="Missing Auth">Missing Auth</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClasses}>Likelihood (1-5)</label>
                  <select name="likelihood" value={formData.likelihood} onChange={handleChange} disabled={loading} className={inputClasses} required>
                    {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Impact (1-5)</label>
                  <select name="impact" value={formData.impact} onChange={handleChange} disabled={loading} className={inputClasses} required>
                    {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>

              {/* CIA Ratings - Compliance Scoping */}
              <div className="bg-black/20 p-3 border border-border/50">
                <label className={labelClasses}>Risk Treatment Strategy</label>
                <select name="treatment" value={formData.treatment} onChange={handleChange} disabled={loading} className={inputClasses} required>
                  <option value="Mitigate">Mitigate (Add Controls)</option>
                  <option value="Accept">Accept (Business Risk)</option>
                  <option value="Transfer">Transfer (Insurance)</option>
                  <option value="Avoid">Avoid (Shutdown Asset)</option>
                </select>
              </div>

              <div className="bg-bg p-3 border-2 border-border flex justify-between items-center">
                <span className="text-[9px] text-text uppercase tracking-widest opacity-60">Quantified Risk:</span>
                <span className={`font-bold text-lg font-orbitron ${getLevelColor(liveRiskLevel)}`}>
                  {liveRiskScore} [{liveRiskLevel}]
                </span>
              </div>

              <button type="submit" disabled={loading} className="bg-primary text-bg font-bold p-2.5 mt-2 uppercase tracking-widest text-[10px] tech-btn">
                {loading ? 'PROCESSING...' : 'Commit Risk Entry'}
              </button>
            </form>
          </div>
        </div>

        <div className="xl:col-span-2 flex flex-col h-full min-h-0">
          <div className="panel-3d p-4 h-full flex flex-col min-h-0">
            <h3 className="text-[11px] font-bold text-primary mb-4 uppercase tracking-widest border-b border-border pb-1">Risk & Treatment Register</h3>
            <div className="flex-1 overflow-auto custom-scrollbar">
              <table className="w-full text-left text-[10px] border-collapse font-mono">
                <thead className="sticky top-0 bg-[#151921] z-10">
                  <tr className="border-b border-border text-accent uppercase tracking-widest">
                    <th className="p-3">System</th>
                    <th className="p-3">Threat</th>
                    <th className="p-3 text-center">Score</th>
                    <th className="p-3">Strategy</th>
                    <th className="p-3 text-right">Ops</th>
                  </tr>
                </thead>
                <tbody>
                  {risks.map((risk) => (
                    <tr key={risk.id} className="border-b border-border/10 hover:bg-white/5 transition-colors">
                      <td className="p-3 text-text opacity-70">
                        {assets.find(a => a.id === parseInt(risk.assetId))?.name || `ID_${risk.assetId}`}
                      </td>
                      <td className="p-3 text-text font-bold text-primary">{risk.threat}</td>
                      <td className="p-3 text-center text-text font-bold">{risk.riskScore}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 border border-[#00F2FF]/30 text-[#00F2FF] text-[8px] uppercase font-bold">
                          {risk.treatment || 'Mitigate'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button disabled={loading} onClick={() => handleDelete(risk.id)} className="tech-btn px-2 py-1 text-danger text-[8px]">RETIRE</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Risks;
