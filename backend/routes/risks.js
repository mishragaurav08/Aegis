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
  const { assetId, threat, vulnerability, likelihood, impact } = req.body;
  try {
    const { riskScore, level } = calculateRisk(likelihood, impact);
    const mitigation = getMitigation(threat);

    const info = db.prepare(
      'INSERT INTO risks (assetId, threat, vulnerability, likelihood, impact, riskScore, level, mitigation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(assetId, threat, vulnerability, likelihood, impact, riskScore, level, mitigation);
    
    // Audit Log
    db.prepare('INSERT INTO audit_logs (action, timestamp) VALUES (?, ?)').run(
      `Risk created for asset ${assetId}: ${threat}`,
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
    db.prepare('DELETE FROM risks WHERE id = ?').run(id);
    
    // Audit Log
    db.prepare('INSERT INTO audit_logs (action, timestamp) VALUES (?, ?)').run(
      `Risk deleted: ${id}`,
      new Date().toISOString()
    );

    res.json({ message: 'Risk deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
