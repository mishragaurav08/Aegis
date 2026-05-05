import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { audioManager } from '../utils/audio';

const API_URL = 'http://localhost:5050';

const Assets = () => {
  const [assets, setAssets] = useState([]);
  const [formData, setFormData] = useState({ 
    name: '', 
    type: 'Server', 
    value: '', 
    owner: '', 
    description: '',
    confidentiality: 3,
    integrity: 3,
    availability: 3
  });
  const [editingId, setEditingId] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [loading, setLoading] = useState(false);

  const fetchAssets = async () => {
    try {
      const res = await axios.get(`${API_URL}/assets`);
      setAssets(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchAssets();
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    
    const submissionData = {
      ...formData,
      value: parseInt(formData.value) || 0,
      confidentiality: parseInt(formData.confidentiality),
      integrity: parseInt(formData.integrity),
      availability: parseInt(formData.availability)
    };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/assets/${editingId}`, submissionData);
        setEditingId(null);
      } else {
        await axios.post(`${API_URL}/assets`, submissionData);
      }
      audioManager.playSuccess();

      setFormData({ 
        name: '', 
        type: 'Server', 
        value: '', 
        owner: '', 
        description: '',
        confidentiality: 3,
        integrity: 3,
        availability: 3
      });
      await fetchAssets();
    } catch (err) {
      console.error("Submit Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (asset) => {
    setFormData(asset);
    setEditingId(asset.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this item?")) return;
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/assets/${id}`);
      audioManager.playAlert();
      await fetchAssets();
    } catch (err) {

      console.error("Delete Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-4 overflow-hidden animate-slide-up">
      <div className="flex justify-between items-center border-b border-border pb-2 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-primary uppercase tracking-widest m-0 font-orbitron">Manage Systems</h2>
          <p className="text-[10px] text-accent uppercase tracking-widest font-bold">Data Collection & Asset Scoping // {currentTime}</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          <div className="panel-3d p-4 flex flex-col shrink-0">
            <h3 className="text-[11px] font-bold text-primary mb-4 uppercase tracking-widest border-b border-border pb-1">System Details</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 font-mono">
              <div className="space-y-1">
                <label className="text-[9px] text-accent uppercase tracking-widest font-bold">System Name</label>
                <input name="name" value={formData.name} onChange={handleChange} disabled={loading} className="w-full text-white" placeholder="e.g. CORE_DB_01" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] text-accent uppercase tracking-widest font-bold">Category</label>
                  <select name="type" value={formData.type} onChange={handleChange} disabled={loading} className="tech-select w-full text-white" required>
                    <option value="Server">Server</option>
                    <option value="Database">Database</option>
                    <option value="Workstation">Workstation</option>
                    <option value="Network Device">Network Device</option>
                    <option value="Application">Application</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-accent uppercase tracking-widest font-bold">Value ($)</label>
                  <input name="value" type="number" value={formData.value} onChange={handleChange} disabled={loading} className="w-full text-white" placeholder="0" required />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-accent uppercase tracking-widest font-bold">Asset Owner</label>
                <input name="owner" value={formData.owner} onChange={handleChange} disabled={loading} className="w-full text-white" placeholder="Name/Dept" required />
              </div>

              <div className="bg-black/20 p-3 border border-border/50">
                <p className="text-[9px] text-primary uppercase font-bold mb-3 tracking-widest">Asset Criticality (CIA 1-5)</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-[8px] text-slate-300 uppercase font-bold">Confid.</label>
                    <input name="confidentiality" type="number" min="1" max="5" value={formData.confidentiality} onChange={handleChange} disabled={loading} className="w-full text-center text-white font-bold" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] text-slate-300 uppercase font-bold">Integ.</label>
                    <input name="integrity" type="number" min="1" max="5" value={formData.integrity} onChange={handleChange} disabled={loading} className="w-full text-center text-white font-bold" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] text-slate-300 uppercase font-bold">Avail.</label>
                    <input name="availability" type="number" min="1" max="5" value={formData.availability} onChange={handleChange} disabled={loading} className="w-full text-center text-white font-bold" required />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="bg-primary text-bg font-bold p-2.5 mt-2 uppercase tracking-widest text-[10px] tech-btn">
                {loading ? 'PROCESSING...' : (editingId ? 'Save Changes' : 'Register System')}
              </button>
            </form>
          </div>
        </div>

        <div className="xl:col-span-2 flex flex-col h-full min-h-0">
          <div className="panel-3d p-4 h-full flex flex-col min-h-0">
            <h3 className="text-[11px] font-bold text-primary mb-4 uppercase tracking-widest border-b border-border pb-1">IT Asset Inventory</h3>
            <div className="flex-1 overflow-auto custom-scrollbar">
              <table className="w-full text-left text-[10px] border-collapse font-mono">
                <thead className="sticky top-0 bg-[#151921] z-10 shadow-sm">
                  <tr className="border-b border-border text-accent uppercase tracking-widest font-black">
                    <th className="p-3">Asset Name</th>
                    <th className="p-3">CIA Rating</th>
                    <th className="p-3">Owner</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset) => (
                    <tr key={asset.id} className="border-b border-border/10 hover:bg-white/5 transition-colors group">
                      <td className="p-3">
                        <div className="font-bold text-[#F1F5F9] text-[11px] group-hover:text-primary transition-colors">{asset.name}</div>
                        <div className="text-[8px] text-slate-500 uppercase">{asset.type}</div>
                      </td>
                      <td className="p-3">
                        <span className="text-[#39FF14] font-bold">{asset.confidentiality}</span>
                        <span className="text-slate-600 mx-1">|</span>
                        <span className="text-[#39FF14] font-bold">{asset.integrity}</span>
                        <span className="text-slate-600 mx-1">|</span>
                        <span className="text-[#39FF14] font-bold">{asset.availability}</span>
                      </td>
                      <td className="p-3 text-slate-300 font-medium">{asset.owner}</td>
                      <td className="p-3 text-right space-x-2">
                        <button disabled={loading} onClick={() => handleEdit(asset)} className="tech-btn px-2 py-1 text-accent text-[8px] border-accent/30 hover:border-accent">EDIT</button>
                        <button disabled={loading} onClick={() => handleDelete(asset.id)} className="tech-btn px-2 py-1 text-danger text-[8px] border-danger/30 hover:border-danger">DELETE</button>
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

export default Assets;
