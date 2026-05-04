const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all audit logs
router.get('/', (req, res) => {
  try {
    const logs = db.prepare('SELECT * FROM audit_logs ORDER BY id DESC').all();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
