const getMitigation = (threat) => {
  const mitigationMap = {
    'Data Theft / Leak': 'Encrypt sensitive data and restrict file access.',
    'Service Shutdown': 'Use backup servers and system redundancy.',
    'Credential Theft': 'Enable Multi-Factor Authentication (MFA) and change passwords.',
    'Phishing Attack': 'Security training for staff and email filters.',
    'Ransomware': 'Keep regular offline backups and use anti-virus software.',
    'SQL Injection': 'Use secure coding practices and database firewalls.',
    'Service Outage': 'Install backup power (UPS) and redundant internet lines.',
    'Phishing': 'Check sender identity and use safe email links.'
  };

  return mitigationMap[threat] || 'Follow standard security best practices.';
};

module.exports = { getMitigation };
