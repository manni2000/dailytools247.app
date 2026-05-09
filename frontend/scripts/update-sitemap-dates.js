#!/usr/bin/env node

/**
 * Script to update sitemap lastmod dates to current date
 * Run this before building: node scripts/update-sitemap-dates.js
 */

const fs = require('fs');
const path = require('path');

const currentDate = new Date().toISOString().split('T')[0];

const sitemapFiles = [
  'public/sitemap.xml',
  'public/sitemap-tools.xml',
  'public/sitemap-pages.xml',
  'public/sitemap-blog.xml'
];

sitemapFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    content = content.replace(/\d{4}-\d{2}-\d{2}/g, currentDate);
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated ${file} with date: ${currentDate}`);
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

console.log('\n✨ All sitemap dates updated successfully!');
