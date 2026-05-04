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

// POST a new asset
router.post('/', (req, res) => {
  const { name, type, value, owner, description } = req.body;
  try {
    const info = db.prepare(
      'INSERT INTO assets (name, type, value, owner, description) VALUES (?, ?, ?, ?, ?)'
    ).run(name, type, value, owner, description);
    
    // Audit Log
    db.prepare('INSERT INTO audit_logs (action, timestamp) VALUES (?, ?)').run(
      `Asset created: ${name}`,
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
  const { name, type, value, owner, description } = req.body;
  try {
    db.prepare(
      'UPDATE assets SET name = ?, type = ?, value = ?, owner = ?, description = ? WHERE id = ?'
    ).run(name, type, value, owner, description, id);
    res.json({ id: parseInt(id), ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE an asset
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM assets WHERE id = ?').run(id);
    res.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
