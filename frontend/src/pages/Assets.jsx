import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5050';

const Assets = () => {
  const [assets, setAssets] = useState([]);
  const [formData, setFormData] = useState({ name: '', type: 'Server', value: '', owner: '', description: '' });
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
    
    // Ensure value is a number
    const submissionData = {
      ...formData,
      value: parseInt(formData.value) || 0
    };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/assets/${editingId}`, submissionData);
        setEditingId(null);
      } else {
        await axios.post(`${API_URL}/assets`, submissionData);
      }
      setFormData({ name: '', type: 'Server', value: '', owner: '', description: '' });
      await fetchAssets();
    } catch (err) {
      console.error("Submit Error:", err.response?.data || err.message);
      alert("Error saving item. Check console.");
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
          <p className="text-[10px] text-accent uppercase tracking-widest font-bold">Adding & Updating Items // {currentTime}</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 flex flex-col gap-4">
          <div className="panel-3d p-4 flex flex-col h-full">
            <h3 className="text-[11px] font-bold text-primary mb-4 uppercase tracking-widest border-b border-border pb-1">Add New Item</h3>
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-3 font-mono">
              <div className="space-y-1">
                <label className="text-[9px] text-accent uppercase tracking-widest">Item Name</label>
                <input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  disabled={loading}
                  className="w-full bg-bg border-2 border-border p-2 text-[10px] text-text focus:border-primary outline-none transition-colors"
                  placeholder="e.g. Main Server" 
                  required 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-accent uppercase tracking-widest">Item Category</label>
                <select name="type" value={formData.type} onChange={handleChange} disabled={loading} className="tech-select w-full" required>
                  <option value="Server">Server</option>
                  <option value="Database">Database</option>
                  <option value="Workstation">Personal Computer</option>
                  <option value="Network Device">Internet Device</option>
                  <option value="Application">Software App</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] text-accent uppercase tracking-widest">Cost ($)</label>
                  <input name="value" type="number" value={formData.value} onChange={handleChange} disabled={loading} className="w-full" placeholder="0.00" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-accent uppercase tracking-widest">Responsible</label>
                  <input name="owner" value={formData.owner} onChange={handleChange} disabled={loading} className="w-full" placeholder="Name" required />
                </div>
              </div>

              <div className="space-y-1 flex-1 flex flex-col min-h-0">
                <label className="text-[9px] text-accent uppercase tracking-widest">Usage</label>
                <select name="description" value={formData.description} onChange={handleChange} disabled={loading} className="tech-select w-full" required>
                  <option value="">-- SELECT USAGE --</option>
                  <option value="Main Production Area">Main Production Area</option>
                  <option value="Testing & Sandbox">Testing & Sandbox</option>
                  <option value="Important Data Storage">Important Data Storage</option>
                  <option value="Public Facing Service">Public Facing Service</option>
                  <option value="Restricted Area">Restricted Area</option>
                </select>
              </div>

              <button type="submit" disabled={loading} className="bg-primary text-bg font-bold p-2.5 mt-2 uppercase tracking-widest text-[10px] border-2 border-primary hover:bg-bg hover:text-primary tech-btn">
                {loading ? 'PROCESSING...' : (editingId ? 'Save Changes' : 'Add Item')}
              </button>
            </form>
          </div>
        </div>

        <div className="xl:col-span-2 flex flex-col h-full min-h-0">
          <div className="panel-3d p-4 h-full flex flex-col min-h-0">
            <h3 className="text-[11px] font-bold text-primary mb-4 uppercase tracking-widest border-b border-border pb-1">System Inventory</h3>
            <div className="flex-1 overflow-auto custom-scrollbar">
              <table className="w-full text-left text-[10px] border-collapse font-mono">
                <thead className="sticky top-0 bg-surface z-10">
                  <tr className="border-b border-border text-accent uppercase tracking-widest">
                    <th className="p-2">Name</th>
                    <th className="p-2">Category</th>
                    <th className="p-2">Value</th>
                    <th className="p-2">Responsible</th>
                    <th className="p-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset) => (
                    <tr key={asset.id} className="border-b border-border/10 hover:bg-white/5 transition-colors">
                      <td className="p-2 text-text font-bold text-primary">{asset.name}</td>
                      <td className="p-2 text-text opacity-70">{asset.type}</td>
                      <td className="p-2 text-text">${Number(asset.value).toLocaleString()}</td>
                      <td className="p-2 text-text">{asset.owner}</td>
                      <td className="p-2 text-right space-x-2">
                        <button disabled={loading} onClick={() => handleEdit(asset)} className="text-accent hover:text-primary uppercase tracking-widest text-[8px] bg-transparent border-none tech-btn px-2 py-1">EDIT</button>
                        <button disabled={loading} onClick={() => handleDelete(asset.id)} className="text-danger hover:brightness-125 uppercase tracking-widest text-[8px] bg-transparent border-none tech-btn px-2 py-1">DELETE</button>
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
