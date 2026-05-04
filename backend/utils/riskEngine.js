const calculateRisk = (likelihood, impact) => {
  const riskScore = likelihood * impact;
  let level = 'Low';

  if (riskScore >= 16) {
    level = 'High';
  } else if (riskScore >= 6) {
    level = 'Medium';
  } else {
    level = 'Low';
  }

  return { riskScore, level };
};

module.exports = { calculateRisk };
