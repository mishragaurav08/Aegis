const express = require('express');
const router = require('express').Router();
const db = require('../db');
const PDFDocument = require('pdfkit');

router.get('/', (req, res) => {
  try {
    const assets = db.prepare('SELECT * FROM assets').all();
    const risks = db.prepare('SELECT * FROM risks').all();
    const logs = db.prepare('SELECT * FROM audit_logs ORDER BY id DESC LIMIT 5').all();

    const doc = new PDFDocument({ 
      margin: 0,
      size: 'A4',
      autoFirstPage: true
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Aegis_Security_Report.pdf');

    doc.pipe(res);

    // Background
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0B0E14');

    // --- Header ---
    doc.fillColor('#39FF14').fontSize(24).text('SECURITY STATUS REPORT', 40, 40, { characterSpacing: 2 });
    doc.fillColor('#F1F5F9').fontSize(8).text('SYSTEM ID: AEGIS-782-X // VERIFIED AUDIT RECORD', 42, 70, { characterSpacing: 1 });
    doc.rect(40, 90, 515, 2).fill('#39FF14');

    // --- Stats ---
    const drawStatBox = (x, y, w, label, val, color) => {
      doc.rect(x + 4, y + 4, w, 55).fill('#000000');
      doc.rect(x, y, w, 55).fill('#151921').stroke('#262B37');
      doc.rect(x, y, 3, 55).fill(color);
      doc.fillColor('#666666').fontSize(7).text(label.toUpperCase(), x + 12, y + 15);
      doc.fillColor(color).fontSize(18).text(val, x + 12, y + 28);
    };

    const highCount = risks.filter(r => r.level === 'High').length;
    const avgScore = risks.length ? (risks.reduce((a,b)=>a+b.riskScore,0)/risks.length).toFixed(1) : '0';

    drawStatBox(40, 115, 120, 'Total Systems', assets.length, '#39FF14');
    drawStatBox(170, 115, 120, 'Identified Risks', risks.length, '#39FF14');
    drawStatBox(300, 115, 120, 'Critical Issues', highCount, '#FF3131');
    drawStatBox(430, 115, 125, 'Safety Score', avgScore, '#00F2FF');

    const colY = 195;

    // SECTION 01: System List
    doc.fillColor('#39FF14').fontSize(11).text('01 // SYSTEM LIST & CRITICALITY', 40, colY);
    doc.fillColor('#666666').fontSize(7).text(`TOTAL SYSTEMS MONITORED: ${assets.length}`, 40, colY + 14);
    doc.rect(40, colY + 24, 245, 1).fill('#1A2236');
    
    let leftY = colY + 32;
    assets.slice(0, 15).forEach((asset, i) => {
      doc.rect(40, leftY, 245, 20).fill(i % 2 === 0 ? '#151921' : '#0B0E14');
      doc.fillColor('#F1F5F9').fontSize(7.5).text(asset.name, 50, leftY + 6, { width: 100, ellipsis: true });
      doc.fillColor('#666666').fontSize(6).text(asset.type.toUpperCase(), 150, leftY + 7);
      doc.fillColor('#39FF14').fontSize(7.5).text(`CIA: ${asset.confidentiality}-${asset.integrity}-${asset.availability}`, 200, leftY + 6, { align: 'right', width: 75 });
      leftY += 20;
    });

    // SECTION 02: Risk Details
    doc.fillColor('#FF3131').fontSize(11).text('02 // SECURITY RISKS', 310, colY);
    doc.fillColor('#666666').fontSize(7).text(`HIGH PRIORITY THREATS: ${highCount}`, 310, colY + 14);
    doc.rect(310, colY + 24, 245, 1).fill('#1A2236');

    let rightY = colY + 32;
    risks.filter(r => r.level === 'High').slice(0, 6).forEach((risk, i) => {
      doc.rect(314, rightY + 4, 245, 50).fill('#000000');
      doc.rect(310, rightY, 245, 50).fill('#151921').stroke('#262B37');
      doc.rect(310, rightY, 3, 50).fill('#FF3131');
      doc.fillColor('#FF3131').fontSize(7).text(risk.threat.toUpperCase(), 322, rightY + 10);
      doc.fillColor('#F1F5F9').fontSize(8.5).text(risk.vulnerability, 322, rightY + 20, { width: 220, height: 10, ellipsis: true });
      doc.fillColor('#39FF14').fontSize(7).text(`FIX: ${risk.mitigation}`, 322, rightY + 32, { width: 220, height: 10, ellipsis: true });
      rightY += 58;
    });

    // SECTION 03: Activity Log
    const auditY = 560;
    doc.fillColor('#00F2FF').fontSize(11).text('03 // RECENT ACTIVITY LOG', 40, auditY);
    doc.rect(40, auditY + 15, 515, 1).fill('#1A2236');
    
    let logY = auditY + 25;
    logs.forEach((log, i) => {
      doc.rect(40, logY, 515, 16).fill(i % 2 === 0 ? '#151921' : '#0B0E14');
      doc.fillColor('#00F2FF').fontSize(7).text(`[${log.action}]`, 48, logY + 5);
      doc.fillColor('#F1F5F9').fontSize(7).text(log.details, 100, logY + 5, { width: 300, ellipsis: true });
      doc.fillColor('#444444').fontSize(6).text(new Date(log.timestamp).toLocaleString(), 400, logY + 5, { align: 'right', width: 140 });
      logY += 16;
    });

    // SECTION 04: Action Plan
    const actionY = 680;
    doc.fillColor('#39FF14').fontSize(11).text('04 // SUGGESTED NEXT STEPS', 40, actionY);
    doc.rect(40, actionY + 15, 515, 1).fill('#1A2236');
    
    const actions = [
      'UPDATE: Run software updates for all critical systems.',
      'CHECK: Review user access and login security.',
      'BACKUP: Ensure all important files are backed up safely.',
      'PROTECT: Use secure connections and anti-virus protection.'
    ];

    actions.forEach((text, i) => {
      const y = actionY + 25 + (i * 20);
      doc.rect(40, y, 515, 16).fill('#151921');
      doc.rect(40, y, 2, 16).fill('#39FF14');
      doc.fillColor('#39FF14').fontSize(8).text('>', 48, y + 4);
      doc.fillColor('#F1F5F9').fontSize(8).text(text, 60, y + 4);
    });

    doc.end();
  } catch (error) {
    res.status(500).send('Report generation failed');
  }
});

module.exports = router;
