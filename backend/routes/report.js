const express = require('express');
const router = require('express').Router();
const db = require('../db');
const PDFDocument = require('pdfkit');

router.get('/', (req, res) => {
  try {
    const assets = db.prepare('SELECT * FROM assets').all();
    const risks = db.prepare('SELECT * FROM risks').all();

    const doc = new PDFDocument({ 
      margin: 0,
      size: 'A4',
      autoFirstPage: true
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Aegis_Security_Report.pdf');

    doc.pipe(res);

    // Deep Space Background
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0B0E14');

    // --- Header Section ---
    doc.fillColor('#39FF14').fontSize(24).text('SECURITY INTEL SNAPSHOT', 40, 40, { characterSpacing: 2 });
    doc.fillColor('#F1F5F9').fontSize(8).text('SYSTEM ID: AEGIS-782-X // CLASSIFICATION: CONFIDENTIAL', 42, 70, { characterSpacing: 1 });
    doc.rect(40, 90, 515, 2).fill('#39FF14');

    // --- Stats Dashboard ---
    const drawStatBox = (x, y, w, label, val, color) => {
      // 3D Shadow
      doc.rect(x + 4, y + 4, w, 55).fill('#000000');
      // Main Box
      doc.rect(x, y, w, 55).fill('#151921').stroke('#262B37');
      // Side accent
      doc.rect(x, y, 3, 55).fill(color);
      
      doc.fillColor('#666666').fontSize(7).text(label.toUpperCase(), x + 12, y + 15);
      doc.fillColor(color).fontSize(18).text(val, x + 12, y + 28);
    };

    const highCount = risks.filter(r => r.level === 'High').length;
    const avgScore = risks.length ? (risks.reduce((a,b)=>a+b.riskScore,0)/risks.length).toFixed(1) : '0';

    drawStatBox(40, 115, 120, 'System Count', assets.length, '#39FF14');
    drawStatBox(170, 115, 120, 'Threat Count', risks.length, '#39FF14');
    drawStatBox(300, 115, 120, 'High Danger', highCount, '#FF3131');
    drawStatBox(430, 115, 125, 'Risk Score', avgScore, '#00F2FF');

    // --- Main Data Columns ---
    const colY = 195;

    // SECTION 01: System Inventory
    doc.fillColor('#39FF14').fontSize(11).text('01 // SYSTEM INVENTORY', 40, colY);
    doc.rect(40, colY + 15, 245, 1).fill('#1A2236');
    
    let leftY = colY + 25;
    assets.slice(0, 18).forEach((asset, i) => {
      doc.rect(40, leftY, 245, 20).fill(i % 2 === 0 ? '#151921' : '#0B0E14');
      doc.fillColor('#F1F5F9').fontSize(7.5).text(asset.name, 50, leftY + 6, { width: 100, ellipsis: true });
      doc.fillColor('#666666').fontSize(6).text(asset.type.toUpperCase(), 150, leftY + 7);
      doc.fillColor('#39FF14').fontSize(7.5).text(`$${(asset.value/1000).toFixed(1)}k`, 230, leftY + 6, { align: 'right', width: 45 });
      leftY += 20;
    });

    // SECTION 02: Critical Risks
    doc.fillColor('#FF3131').fontSize(11).text('02 // CRITICAL THREATS', 310, colY);
    doc.rect(310, colY + 15, 245, 1).fill('#1A2236');

    let rightY = colY + 25;
    risks.filter(r => r.level === 'High').slice(0, 8).forEach((risk, i) => {
      // 3D Card
      doc.rect(314, rightY + 4, 245, 50).fill('#000000');
      doc.rect(310, rightY, 245, 50).fill('#151921').stroke('#262B37');
      doc.rect(310, rightY, 3, 50).fill('#FF3131');

      doc.fillColor('#FF3131').fontSize(7).text(risk.threat.toUpperCase(), 322, rightY + 10);
      doc.fillColor('#F1F5F9').fontSize(9).text(risk.vulnerability, 322, rightY + 20, { width: 220, height: 10, ellipsis: true });
      doc.fillColor('#39FF14').fontSize(7).text(`FIX: ${risk.mitigation}`, 322, rightY + 32, { width: 220, height: 10, ellipsis: true });
      rightY += 58;
    });

    // --- Action Plan ---
    const actionY = 660;
    doc.fillColor('#39FF14').fontSize(11).text('03 // PRIORITY ACTION PLAN', 40, actionY);
    doc.rect(40, actionY + 15, 515, 1).fill('#1A2236');
    
    const actions = [
      'PATCH: Execute security updates for critical production nodes.',
      'AUDIT: Verify credential integrity for remote access points.',
      'INVENTORY: Validate hardware IDs for newly deployed hardware.',
      'ENCRYPT: Enable TLS 1.3 for all public-facing application services.'
    ];

    actions.forEach((text, i) => {
      const y = actionY + 25 + (i * 22);
      doc.rect(40, y, 515, 18).fill('#151921');
      doc.rect(40, y, 2, 18).fill('#39FF14');
      doc.fillColor('#39FF14').fontSize(8).text('>', 48, y + 5);
      doc.fillColor('#F1F5F9').fontSize(8).text(text, 60, y + 5);
    });

    // End of Document
    doc.end();

  } catch (error) {
    res.status(500).send('Report generation failed');
  }
});

module.exports = router;
