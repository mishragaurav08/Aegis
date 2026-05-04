const axios = require('axios');
const API = 'http://localhost:5050';

(async () => {
  try {
    console.log('1. Adding Asset...');
    const assetRes = await axios.post(`${API}/assets`, {
      name: 'E2E Test DB', type: 'Database', value: 100, owner: 'Admin', description: 'Test'
    });
    const assetId = assetRes.data.id;
    console.log('Asset added:', assetId);

    console.log('2. Adding Risk...');
    const riskRes = await axios.post(`${API}/risks`, {
      assetId, threat: 'SQL Injection', vulnerability: 'Unsanitized input', likelihood: 4, impact: 5
    });
    console.log('Risk added with score:', riskRes.data.riskScore, 'level:', riskRes.data.level);

    console.log('3. Downloading Report...');
    const reportRes = await axios.get(`${API}/report`, { responseType: 'blob' });
    console.log('Report downloaded successfully, status:', reportRes.status);

    console.log('4. Checking Logs...');
    const logsRes = await axios.get(`${API}/audit`);
    console.log('Logs found:', logsRes.data.length > 0 ? 'Yes' : 'No');
    
    console.log('ALL TESTS PASSED');
  } catch (err) {
    console.error('TEST FAILED:', err.message);
  }
})();
