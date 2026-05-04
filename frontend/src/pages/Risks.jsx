import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5050';

const Risks = () => {
  const [risks, setRisks] = useState([]);
  const [assets, setAssets] = useState([]);
  const [formData, setFormData] = useState({ assetId: '', threat: 'Data Theft / Leak', vulnerability: '', likelihood: 1, impact: 1 });
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
      setFormData({ assetId: '', threat: 'Data Theft / Leak', vulnerability: '', likelihood: 1, impact: 1 });
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
      await fetchRisks();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level) => {
    if (level === 'High') return 'text-danger';
    if (level === 'Medium') return 'text-warning';
    return 'text-primary';
  };

  const inputClasses = "w-full bg-bg border-2 border-border p-2 text-[10px] text-text focus:border-primary outline-none transition-colors tech-select disabled:opacity-50";
  const labelClasses = "text-[9px] text-accent uppercase tracking-widest font-bold mb-1 block";

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-4 overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-border pb-2 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-primary uppercase tracking-widest m-0 font-orbitron">Risk Assessment</h2>
          <p className="text-[10px] text-accent uppercase tracking-widest font-bold">Identifying Security Problems // {currentTime}</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Side: Form */}
        <div className="xl:col-span-1 flex flex-col gap-4">
          <div className="panel-3d p-4 flex flex-col h-full overflow-y-auto custom-scrollbar">
            <h3 className="text-[11px] font-bold text-primary mb-4 uppercase tracking-widest border-b border-border pb-1">Report New Risk</h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 font-mono">
              <div>
                <label className={labelClasses}>Which Item?</label>
                <select name="assetId" value={formData.assetId} onChange={handleChange} disabled={loading} className={inputClasses} required>
                  <option value="">-- SELECT ITEM --</option>
                  {assets.map(asset => (
                    <option key={asset.id} value={asset.id}>{asset.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className={labelClasses}>Type of Danger</label>
                <select name="threat" value={formData.threat} onChange={handleChange} disabled={loading} className={inputClasses} required>
                  <option value="Data Theft / Leak">Data Theft / Leak</option>
                  <option value="Service Shutdown">Service Shutdown</option>
                  <option value="Easy Password Access">Easy Password Access</option>
                  <option value="Scam / Fake Email">Scam / Fake Email</option>
                  <option value="Virus / Harmful Software">Virus / Harmful Software</option>
                </select>
              </div>

              <div>
                <label className={labelClasses}>Security Weakness</label>
                <select 
                  name="vulnerability" 
                  value={formData.vulnerability} 
                  onChange={handleChange} 
                  disabled={loading}
                  className={inputClasses}
                  required 
                >
                  <option value="">-- SELECT WEAKNESS --</option>
                  <option value="Outdated Software">Outdated Software</option>
                  <option value="Bad Access Settings">Bad Access Settings</option>
                  <option value="Weak Security Code">Weak Security Code</option>
                  <option value="Missing Input Checks">Missing Input Checks</option>
                  <option value="Exposed Admin Panel">Exposed Admin Panel</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClasses}>Chance (1-5)</label>
                  <select name="likelihood" value={formData.likelihood} onChange={handleChange} disabled={loading} className={inputClasses} required>
                    {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Damage (1-5)</label>
                  <select name="impact" value={formData.impact} onChange={handleChange} disabled={loading} className={inputClasses} required>
                    {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>

              <div className="bg-bg p-3 border-2 border-border flex justify-between items-center mt-2">
                <span className="text-[9px] text-text uppercase tracking-widest opacity-60">Risk Score:</span>
                <span className={`font-bold text-lg font-orbitron ${getLevelColor(liveRiskLevel)}`}>
                  {liveRiskScore} [{liveRiskLevel}]
                </span>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="bg-primary text-bg font-bold p-2.5 mt-2 uppercase tracking-widest text-[10px] border-2 border-primary hover:bg-bg hover:text-primary tech-btn disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'PROCESSING...' : 'Add Risk To List'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Table */}
        <div className="xl:col-span-2 flex flex-col h-full min-h-0">
          <div className="panel-3d p-4 h-full flex flex-col min-h-0">
            <h3 className="text-[11px] font-bold text-primary mb-4 uppercase tracking-widest border-b border-border pb-1">Current Risk List</h3>
            
            <div className="flex-1 overflow-auto custom-scrollbar">
              <table className="w-full text-left text-[10px] border-collapse font-mono">
                <thead className="sticky top-0 bg-surface z-10">
                  <tr className="border-b border-border text-accent uppercase tracking-widest">
                    <th className="p-2">Item</th>
                    <th className="p-2">Danger</th>
                    <th className="p-2 text-center">Score</th>
                    <th className="p-2">Level</th>
                    <th className="p-2 text-right">Ops</th>
                  </tr>
                </thead>
                <tbody>
                  {risks.map((risk) => (
                    <tr key={risk.id} className="border-b border-border/10 hover:bg-white/5 transition-colors">
                      <td className="p-2 text-text opacity-70">ITEM_{risk.assetId}</td>
                      <td className="p-2 text-text font-bold text-primary">{risk.threat}</td>
                      <td className="p-2 text-center text-text">{risk.riskScore}</td>
                      <td className={`p-2 font-bold uppercase tracking-widest ${getLevelColor(risk.level)}`}>
                        {risk.level}
                      </td>
                      <td className="p-2 text-right">
                        <button disabled={loading} onClick={() => handleDelete(risk.id)} className="text-danger hover:brightness-125 uppercase tracking-widest text-[8px] bg-transparent border-none tech-btn px-2 py-1 disabled:opacity-30">REMOVE</button>
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
