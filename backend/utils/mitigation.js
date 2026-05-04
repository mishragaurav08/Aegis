const getMitigation = (threat) => {
  const mitigationMap = {
    'SQL Injection': 'Use prepared statements',
    'DDoS': 'Rate limiting',
    'Weak Password': 'Strong password policy'
  };

  return mitigationMap[threat] || 'Implement standard security controls';
};

module.exports = { getMitigation };
