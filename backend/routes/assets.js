const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all assets
router.get('/', (req, res) => {
  try {
    const assets = db.prepare('SELECT * FROM assets').all();
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET audit logs
router.get('/logs', (req, res) => {
  try {
    const logs = db.prepare('SELECT * FROM audit_logs ORDER BY id DESC').all();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new asset
router.post('/', (req, res) => {
  const { name, type, value, owner, description, confidentiality, integrity, availability } = req.body;
  
  // ROBUSTNESS: Input Validation
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'System name is required.' });
  }
  
  const c = Math.min(5, Math.max(1, parseInt(confidentiality) || 3));
  const i = Math.min(5, Math.max(1, parseInt(integrity) || 3));
  const a = Math.min(5, Math.max(1, parseInt(availability) || 3));

  try {
    const info = db.prepare(
      'INSERT INTO assets (name, type, value, owner, description, confidentiality, integrity, availability) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(name, type, value || 0, owner || 'Unknown', description || 'N/A', c, i, a);
    
    db.prepare('INSERT INTO audit_logs (action, entity, details, timestamp) VALUES (?, ?, ?, ?)').run(
      'CREATE',
      'ASSET',
      `System registered: ${name} (CIA: ${c}-${i}-${a})`,
      new Date().toISOString()
    );

    res.status(201).json({ id: info.lastInsertRowid, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update an asset
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, type, value, owner, description, confidentiality, integrity, availability } = req.body;
  
  // ROBUSTNESS: Range clamping for CIA scores
  const c = Math.min(5, Math.max(1, parseInt(confidentiality) || 3));
  const i = Math.min(5, Math.max(1, parseInt(integrity) || 3));
  const a = Math.min(5, Math.max(1, parseInt(availability) || 3));

  try {
    db.prepare(
      'UPDATE assets SET name = ?, type = ?, value = ?, owner = ?, description = ?, confidentiality = ?, integrity = ?, availability = ? WHERE id = ?'
    ).run(name, type, value, owner, description, c, i, a, id);

    db.prepare('INSERT INTO audit_logs (action, entity, details, timestamp) VALUES (?, ?, ?, ?)').run(
      'UPDATE',
      'ASSET',
      `System updated: ${name} (New CIA: ${c}-${i}-${a})`,
      new Date().toISOString()
    );

    res.json({ id: parseInt(id), ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE an asset
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  try {
    const asset = db.prepare('SELECT name FROM assets WHERE id = ?').get(id);
    db.prepare('DELETE FROM risks WHERE assetId = ?').run(id);
    db.prepare('DELETE FROM assets WHERE id = ?').run(id);

    db.prepare('INSERT INTO audit_logs (action, entity, details, timestamp) VALUES (?, ?, ?, ?)').run(
      'DELETE',
      'ASSET',
      `System decommissioned: ${asset ? asset.name : 'Unknown ID: ' + id} (Risks purged)`,
      new Date().toISOString()
    );

    res.json({ message: 'Asset and associated risks deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
