const express = require('express');
const router = express.Router();
const db = require('../db');
const { calculateRisk } = require('../utils/riskEngine');
const { getMitigation } = require('../utils/mitigation');

// GET all risks
router.get('/', (req, res) => {
  try {
    const risks = db.prepare('SELECT * FROM risks').all();
    res.json(risks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new risk
router.post('/', (req, res) => {
  const { assetId, threat, vulnerability, likelihood, impact, treatment } = req.body;
  
  // ROBUSTNESS: Basic validation
  if (!assetId) {
    return res.status(400).json({ error: 'Target asset is required.' });
  }

  try {
    const l = Math.min(5, Math.max(1, parseInt(likelihood) || 1));
    const im = Math.min(5, Math.max(1, parseInt(impact) || 1));
    
    const { riskScore, level } = calculateRisk(l, im);
    const mitigation = getMitigation(threat);

    const info = db.prepare(
      'INSERT INTO risks (assetId, threat, vulnerability, likelihood, impact, riskScore, level, mitigation, treatment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(assetId, threat, vulnerability || 'Not Specified', l, im, riskScore, level, mitigation, treatment || 'Mitigate');
    
    db.prepare('INSERT INTO audit_logs (action, entity, details, timestamp) VALUES (?, ?, ?, ?)').run(
      'CREATE',
      'RISK',
      `Risk identified for asset ${assetId}: ${threat} (Level: ${level})`,
      new Date().toISOString()
    );

    res.status(201).json({ id: info.lastInsertRowid, ...req.body, riskScore, level, mitigation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a risk
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  try {
    const risk = db.prepare('SELECT threat FROM risks WHERE id = ?').get(id);
    db.prepare('DELETE FROM risks WHERE id = ?').run(id);
    
    db.prepare('INSERT INTO audit_logs (action, entity, details, timestamp) VALUES (?, ?, ?, ?)').run(
      'DELETE',
      'RISK',
      `Threat removed: ${risk ? risk.threat : 'ID ' + id}`,
      new Date().toISOString()
    );

    res.json({ message: 'Risk deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
