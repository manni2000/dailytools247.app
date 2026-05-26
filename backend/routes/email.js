const express = require('express');
const { strictLimiter } = require('../middleware/security');
const dns = require('dns').promises;
const crypto = require('crypto');

const router = express.Router();
router.use(strictLimiter);

// -------------------------------------------------------------
// 1. Email Subject Line Generator
// -------------------------------------------------------------
router.post('/subject-line-generator', (req, res) => {
  const { keywords = '', tone = 'professional', category = 'newsletter' } = req.body;
  
  if (!keywords.trim()) {
    return res.status(400).json({ success: false, error: 'Keywords are required' });
  }

  const word = keywords.trim();
  
  // Formulas depending on category and tone
  const formulas = {
    newsletter: [
      { template: `Your weekly digest on {word}`, score: 85 },
      { template: `Let's talk about {word} (Inside details)`, score: 90 },
      { template: `The future of {word} is here`, score: 92 },
      { template: `Curated insights: What's new with {word}?`, score: 88 },
      { template: `Unlocking the secrets of {word} 🔓`, score: 94 },
    ],
    promotional: [
      { template: `Get {word} for 50% off today only! 🏷️`, score: 95 },
      { template: `Exclusive offer: Elevate your work with {word}`, score: 89 },
      { template: `Say hello to your new favorite: {word}`, score: 87 },
      { template: `Tired of the old way? Meet {word}`, score: 91 },
      { template: `Don't miss out: Premium access to {word}`, score: 93 },
    ],
    urgency: [
      { template: `Last chance: {word} deal expires in 3 hours! ⏳`, score: 98 },
      { template: `Urgent update regarding your {word} access`, score: 94 },
      { template: `Closing soon: Claim your {word} copy now`, score: 91 },
      { template: `Are you in or out? {word} slots are filling up`, score: 88 },
      { template: `Only 5 spots left for {word}!`, score: 96 },
    ],
    'follow-up': [
      { template: `Quick follow up: question about {word}`, score: 90 },
      { template: `Did you see this info on {word}?`, score: 88 },
      { template: `Next steps for {word} - let's connect`, score: 92 },
      { template: `Following up on our conversation about {word}`, score: 87 },
      { template: `A quick note on {word}`, score: 85 },
    ],
    'cold-outreach': [
      { template: `Ideas for scaling {word} at your company`, score: 93 },
      { template: `Could {word} solve your team's biggest challenge?`, score: 91 },
      { template: `Quick question about {word} management`, score: 89 },
      { template: `Improve your workflow with {word} today`, score: 86 },
      { template: `Frustrated with {word}? Let's chat`, score: 88 },
    ],
    welcome: [
      { template: `Welcome! Here is your guide to {word} 🎉`, score: 97 },
      { template: `You're in! Let's get started with {word}`, score: 95 },
      { template: `Welcome to the community: Let's master {word}`, score: 92 },
      { template: `First steps with {word} (Inside information)`, score: 89 },
      { template: `Glad you're here! Your {word} inside`, score: 91 },
    ],
  };

  // Select list based on category, fallback to newsletter
  const list = formulas[category] || formulas.newsletter;
  
  // Custom adjust based on tone
  const toneAdjustments = {
    professional: { prefix: '', suffix: '', modifier: 0 },
    casual: { prefix: 'Hey, ', suffix: '?', modifier: 2 },
    funny: { prefix: 'Wait, ', suffix: ' (no jokes) 🤫', modifier: -3 },
    witty: { prefix: 'Why you need ', suffix: ' (right now)', modifier: 4 },
    assertive: { prefix: 'Stop ignoring ', suffix: '!', modifier: 1 },
    curious: { prefix: 'Have you heard about ', suffix: ' yet?', modifier: 3 },
  };
  
  const adj = toneAdjustments[tone] || toneAdjustments.professional;

  const results = list.map((item, idx) => {
    let rawSub = item.template.replace(/{word}/g, word);
    
    // Apply tone modifiers sometimes (e.g. for variation)
    if (idx % 2 === 0) {
      rawSub = `${adj.prefix}${rawSub}${adj.suffix}`;
    }

    let finalScore = Math.min(100, Math.max(30, item.score + adj.modifier));
    
    // Length penalty/bonus
    if (rawSub.length > 60) {
      finalScore -= 5;
    } else if (rawSub.length >= 40 && rawSub.length <= 55) {
      finalScore += 3;
    }

    // Power words bonuses
    const powerWords = ['exclusive', 'free', 'save', 'urgent', 'now', 'unlock', 'secrets', 'proven', 'only'];
    let powerCount = 0;
    powerWords.forEach(pw => {
      if (rawSub.toLowerCase().includes(pw)) powerCount++;
    });
    finalScore += powerCount * 2;
    finalScore = Math.min(100, finalScore);

    let rating = 'Excellent';
    let reason = 'Perfect length and highly engaging for your audience.';
    let tips = 'Good job! This subject line is optimized for high open rates.';

    if (finalScore < 70) {
      rating = 'Needs Improvement';
      reason = 'Subject line might be too long, spammy, or lack urgency.';
      tips = 'Try shortening the text, adding an action verb, or incorporating a relevant emoji.';
    } else if (finalScore < 85) {
      rating = 'Good';
      reason = 'A solid subject line with decent appeal.';
      tips = 'Consider testing a personalized element (like a name hook) or adding a power word.';
    }

    return {
      subject: rawSub,
      score: finalScore,
      rating,
      reason,
      tips,
    };
  });

  res.json({ success: true, results });
});

// -------------------------------------------------------------
// 2. Email Signature Generator
// -------------------------------------------------------------
router.post('/signature-generator', (req, res) => {
  const {
    name = 'John Doe',
    role = 'Marketing Specialist',
    company = 'Acme Corp',
    phone = '+1 (555) 019-2834',
    email = 'john@example.com',
    website = 'www.example.com',
    address = '123 Business Rd, Suite 100',
    avatarUrl = '',
    socialLinks = {},
    primaryColor = '#4f46e5',
    accentColor = '#f59e0b',
    layout = 'classic'
  } = req.body;

  let html = '';

  const socialHTML = Object.entries(socialLinks)
    .filter(([_, url]) => url && url.trim())
    .map(([platform, url]) => {
      const cap = platform.charAt(0).toUpperCase() + platform.slice(1);
      return `<a href="${url.trim()}" style="color: ${accentColor}; text-decoration: none; margin-right: 10px; font-size: 13px; font-weight: bold;">${cap}</a>`;
    })
    .join(' ');

  const imageTag = avatarUrl.trim()
    ? `<img src="${avatarUrl.trim()}" alt="${name}" width="90" height="90" style="border-radius: 50%; display: block; border: 2px solid ${primaryColor}; object-fit: cover;" />`
    : `<div style="width: 90px; height: 90px; border-radius: 50%; background-color: ${primaryColor}; color: #ffffff; text-align: center; line-height: 90px; font-size: 32px; font-weight: bold; font-family: Helvetica, Arial, sans-serif;">${name.charAt(0)}</div>`;

  if (layout === 'classic') {
    html = `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Helvetica, Arial, sans-serif; color: #333333; line-height: 1.4; font-size: 14px;">
  <tr>
    <td valign="top" style="padding-right: 20px; border-right: 3px solid ${primaryColor};">
      ${imageTag}
    </td>
    <td valign="top" style="padding-left: 20px;">
      <div style="font-weight: bold; font-size: 18px; color: ${primaryColor};">${name}</div>
      <div style="font-style: italic; color: #666666; margin-bottom: 8px;">${role} | <strong>${company}</strong></div>
      <div style="margin-bottom: 4px;">📞 <a href="tel:${phone}" style="color: #333333; text-decoration: none;">${phone}</a></div>
      <div style="margin-bottom: 4px;">✉️ <a href="mailto:${email}" style="color: #333333; text-decoration: none;">${email}</a></div>
      <div style="margin-bottom: 8px;">🌐 <a href="https://${website}" target="_blank" style="color: ${primaryColor}; text-decoration: none; font-weight: bold;">${website}</a></div>
      ${socialHTML ? `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eeeeee;">${socialHTML}</div>` : ''}
    </td>
  </tr>
</table>`;
  } else if (layout === 'modern') {
    html = `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; color: #222222; line-height: 1.5; font-size: 13px; max-width: 500px; background-color: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px solid #eef0f2;">
  <tr>
    <td align="center" valign="middle" style="padding-right: 15px; width: 100px;">
      ${imageTag}
    </td>
    <td valign="top">
      <div style="font-weight: 800; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; color: ${primaryColor}; margin-bottom: 2px;">${name}</div>
      <div style="font-weight: 600; color: #444444; margin-bottom: 10px;">${role} @ <span style="color: ${accentColor};">${company}</span></div>
      <table cellpadding="0" cellspacing="0" border="0" style="font-size: 13px; color: #555555;">
        <tr><td style="padding-bottom: 3px;"><strong>Phone:</strong> ${phone}</td></tr>
        <tr><td style="padding-bottom: 3px;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #555555; text-decoration: none;">${email}</a></td></tr>
        <tr><td style="padding-bottom: 3px;"><strong>Web:</strong> <a href="https://${website}" target="_blank" style="color: ${primaryColor}; text-decoration: none;">${website}</a></td></tr>
        <tr><td style="font-size: 11px; color: #888888; padding-top: 4px;">📍 ${address}</td></tr>
      </table>
      ${socialHTML ? `<div style="margin-top: 10px;">${socialHTML}</div>` : ''}
    </td>
  </tr>
</table>`;
  } else if (layout === 'minimalist') {
    html = `
<div style="font-family: 'Courier New', Courier, monospace; color: #444444; font-size: 13px; line-height: 1.6;">
  <div style="font-weight: bold; font-size: 15px; color: #111111;">// ${name}</div>
  <div style="color: #777777; margin-bottom: 8px;">${role} — ${company}</div>
  <div>t. ${phone}</div>
  <div>e. <a href="mailto:${email}" style="color: #444444; text-decoration: none; border-bottom: 1px dashed ${primaryColor};">${email}</a></div>
  <div>w. <a href="https://${website}" target="_blank" style="color: ${primaryColor}; text-decoration: none;">${website}</a></div>
  ${socialHTML ? `<div style="margin-top: 6px; font-size: 11px;">[ ${socialHTML.replace(/margin-right: 10px;/g, 'margin-right: 15px;')} ]</div>` : ''}
</div>`;
  } else {
    // Creative
    html = `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333333; line-height: 1.4; font-size: 13px; border-left: 4px double ${accentColor}; padding-left: 15px;">
  <tr>
    <td valign="top">
      <div style="font-size: 20px; font-weight: 900; background: ${primaryColor}; color: white; display: inline-block; padding: 3px 10px; border-radius: 4px; margin-bottom: 6px;">${name}</div>
      <div style="font-weight: bold; color: #333333; font-size: 14px; margin-bottom: 8px;">${role} <span style="color: ${accentColor};">/</span> ${company}</div>
      <div style="color: #666666;">
        <span style="margin-right: 15px;"><strong>M:</strong> ${phone}</span>
        <span><strong>E:</strong> <a href="mailto:${email}" style="color: #333333; text-decoration: none;">${email}</a></span>
      </div>
      <div style="color: #666666; margin-bottom: 8px;">
        <span style="margin-right: 15px;"><strong>W:</strong> <a href="https://${website}" target="_blank" style="color: ${accentColor}; text-decoration: none; font-weight: bold;">${website}</a></span>
        <span><strong>A:</strong> ${address}</span>
      </div>
      ${socialHTML ? `<div style="margin-top: 10px; background-color: #f3f4f6; padding: 6px; border-radius: 4px; display: inline-block;">${socialHTML}</div>` : ''}
    </td>
  </tr>
</table>`;
  }

  res.json({ success: true, html });
});

// -------------------------------------------------------------
// 3. HTML Email Previewer & Analyzer
// -------------------------------------------------------------
router.post('/previewer-analyze', (req, res) => {
  const { html = '' } = req.body;

  if (!html.trim()) {
    return res.status(400).json({ success: false, error: 'HTML code is required' });
  }

  const issues = [];
  let score = 100;

  // Simple string-based parsing for analyzer rules
  if (html.includes('<style') || html.includes('</style>')) {
    issues.push({
      type: 'warning',
      message: 'Embedded CSS <style> block detected. Many email clients (like Gmail mobile or Outlook) have poor support for head styles. We recommend using inline style attributes instead.',
    });
    score -= 10;
  }

  if (/<script/i.test(html)) {
    issues.push({
      type: 'error',
      message: 'Javascript <script> tags detected. Scripts are universally blocked by all email clients for security reasons. Remove all JS code.',
    });
    score -= 30;
  }

  if (/<iframe/i.test(html)) {
    issues.push({
      type: 'error',
      message: '<iframe> tag detected. Inline frames are blocked by email clients. Use links instead.',
    });
    score -= 20;
  }

  if (/<form/i.test(html)) {
    issues.push({
      type: 'warning',
      message: '<form> element detected. Interactive forms have very limited support in email clients (often show security warnings). Use simple links/buttons instead.',
    });
    score -= 10;
  }

  // Count images and check alt tags
  const imgMatches = html.match(/<img[^>]*>/gi) || [];
  let missingAlt = 0;
  imgMatches.forEach(img => {
    if (!/alt=["']/i.test(img) || /alt=["']\s*["']/i.test(img)) {
      missingAlt++;
    }
  });

  if (missingAlt > 0) {
    issues.push({
      type: 'warning',
      message: `${missingAlt} <img> tag(s) are missing descriptive "alt" attributes. Alt text ensures accessibility and renders when images are blocked by default.`,
    });
    score -= Math.min(15, missingAlt * 5);
  }

  // Check unsubscribe keywords
  const textContent = html.replace(/<[^>]*>/g, ' ').toLowerCase();
  const hasUnsubscribe = textContent.includes('unsubscribe') || 
                         textContent.includes('opt out') || 
                         textContent.includes('opt-out') ||
                         textContent.includes('preferences');
                         
  if (!hasUnsubscribe) {
    issues.push({
      type: 'error',
      message: 'No unsubscribe mechanism found. Marketing emails must include a clear way for recipients to opt out (CAN-SPAM act compliance).',
    });
    score -= 20;
  }

  // Size limit warning
  const htmlSize = Buffer.byteLength(html, 'utf8');
  if (htmlSize > 102400) { // 100KB
    issues.push({
      type: 'warning',
      message: `HTML size is ${(htmlSize / 1024).toFixed(1)} KB. Gmail clips emails larger than 102 KB, hiding content and tracking pixels behind a "View entire message" link.`,
    });
    score -= 15;
  }

  score = Math.max(0, score);

  res.json({
    success: true,
    score,
    issues,
    sizeKb: (htmlSize / 1024).toFixed(2),
  });
});

// -------------------------------------------------------------
// 4. Spam Score Checker
// -------------------------------------------------------------
router.post('/spam-checker', (req, res) => {
  const { subject = '', body = '' } = req.body;

  if (!subject.trim() && !body.trim()) {
    return res.status(400).json({ success: false, error: 'Subject or body is required' });
  }

  const spamWords = [
    'make money', 'cash bonus', 'refinance', 'earn money', 'investment', 
    'credit card', 'loans', 'no fees', 'lowest price', 'save money', 
    'million dollars', 'income', 'mortgage', 'debt', 'act now', 
    'limited time', 'click here', 'urgent', 'do it today', 'winner', 
    'congratulations', '100% free', 'risk free', 'cancel at any time', 
    'guaranteed', 'satisfaction guaranteed', 'no catch', 'deal', 
    'discount', 'special promotion', 'best price', 'shoppers', 
    'clearance', 'sale', 'order now', 'buy today', 'make $', 
    'work from home', 'passive income', 'as seen on', 'billion', 'eliminate debt'
  ];

  const foundWords = [];
  const recs = [];
  let score = 100;

  const combinedText = `${subject.toLowerCase()} ${body.toLowerCase()}`;

  spamWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = combinedText.match(regex);
    if (matches) {
      foundWords.push(`${word} (${matches.length}x)`);
      score -= matches.length * 4;
    }
  });

  // Caps lock checks
  const subjectCaps = subject.replace(/[^A-Z]/g, '').length;
  const subjectTotal = subject.replace(/[^a-zA-Z]/g, '').length;
  if (subjectTotal > 5 && (subjectCaps / subjectTotal) > 0.4) {
    recs.push('Reduce capitalized letters in subject line. USING ALL CAPS looks like shouting and triggers spam filters.');
    score -= 15;
  }

  // Excessive punctuation
  if (/!{2,}/.test(subject) || /!{2,}/.test(body)) {
    recs.push('Avoid multiple consecutive exclamation marks (!!!) in subject or body.');
    score -= 10;
  }
  if (/\?{2,}/.test(subject)) {
    recs.push('Avoid consecutive question marks (??) in the subject line.');
    score -= 8;
  }

  // Link to text checks
  const linkMatches = body.match(/<a\s+[^>]*href=["']([^"']+)["']/gi) || [];
  const textOnly = body.replace(/<[^>]*>/g, '').trim();
  if (linkMatches.length > 5 && textOnly.length < 500) {
    recs.push('High link-to-text ratio. Add more body text or reduce the number of hyperlinks to look organic to mail filters.');
    score -= 12;
  }

  score = Math.max(0, score);
  let rating = 'Very Low Risk';
  if (score < 40) {
    rating = 'High Spam Risk';
    recs.push('CRITICAL: Rewrite your content. It contains a high frequency of sales pitch buzzwords and formatting inconsistencies.');
  } else if (score < 75) {
    rating = 'Moderate Spam Risk';
    recs.push('TIP: Try swapping promotional keywords for more educational or descriptive terms.');
  }

  res.json({
    success: true,
    score,
    rating,
    spamWordsFound: foundWords,
    recommendations: recs.length > 0 ? recs : ['Your email formatting and language are clean! Very low spam probability.']
  });
});

// -------------------------------------------------------------
// 5. Email Template Builder
// -------------------------------------------------------------
router.post('/template-builder', (req, res) => {
  const {
    layout = 'newsletter',
    content = {}
  } = req.body;

  const title = content.title || 'Weekly Highlights';
  const subtitle = content.subtitle || 'Your curated list of articles, tips, and updates';
  const body = content.body || 'We hope you are having a productive week. Check out our latest news and make sure to leave your feedback.';
  const buttonText = content.buttonText || 'Read More';
  const buttonUrl = content.buttonUrl || 'https://example.com';
  const imageUrl = content.imageUrl || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=60';
  const footerText = content.footerText || '© 2026 Acme Corp. 123 Street Rd, NY. All rights reserved. You are receiving this because you subscribed.';

  let compiledHtml = '';

  const baseHeader = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f3f4f6; padding: 20px 0;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); max-width: 600px; width: 100%;">
  `;

  const baseFooter = `
          <!-- Footer -->
          <tr>
            <td style="background-color: #1f2937; padding: 30px; text-align: center; color: #9ca3af; font-size: 12px; line-height: 1.6;">
              <p style="margin: 0 0 10px 0;">${footerText}</p>
              <p style="margin: 0;">If you wish to opt out, you can <a href="#" style="color: #6366f1; text-decoration: underline;">unsubscribe here</a>.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  if (layout === 'newsletter') {
    compiledHtml = `${baseHeader}
          <!-- Banner Image -->
          <tr>
            <td>
              <img src="${imageUrl}" alt="Banner" width="600" style="width: 100%; max-width: 600px; display: block; height: auto;" />
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h1 style="margin: 0 0 10px 0; color: #111827; font-size: 26px; font-weight: bold; line-height: 1.2;">${title}</h1>
              <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.5; font-style: italic;">${subtitle}</p>
              <div style="height: 1px; background-color: #e5e7eb; margin-bottom: 25px;"></div>
              <p style="margin: 0 0 30px 0; color: #374151; font-size: 15px; line-height: 1.6;">${body}</p>
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="border-radius: 6px; background-color: #6366f1;">
                    <a href="${buttonUrl}" target="_blank" style="display: inline-block; padding: 14px 24px; font-size: 15px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 6px;">${buttonText}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
    ${baseFooter}`;
  } else if (layout === 'promotional') {
    compiledHtml = `${baseHeader}
          <!-- Promo Header -->
          <tr>
            <td style="background-color: #4f46e5; padding: 50px 30px; text-align: center; color: #ffffff;">
              <h1 style="margin: 0 0 10px 0; font-size: 32px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">${title}</h1>
              <p style="margin: 0; font-size: 18px; opacity: 0.9;">${subtitle}</p>
            </td>
          </tr>
          <!-- Promo Body -->
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <p style="margin: 0 0 25px 0; color: #374151; font-size: 16px; line-height: 1.6;">${body}</p>
              <table border="0" cellspacing="0" cellpadding="0" align="center" style="margin-bottom: 30px;">
                <tr>
                  <td align="center" style="border-radius: 50px; background-color: #f59e0b;">
                    <a href="${buttonUrl}" target="_blank" style="display: inline-block; padding: 15px 35px; font-size: 16px; font-weight: 800; color: #ffffff; text-decoration: none; border-radius: 50px; text-transform: uppercase;">${buttonText}</a>
                  </td>
                </tr>
              </table>
              <img src="${imageUrl}" alt="Promo Banner" width="540" style="max-width: 100%; border-radius: 8px; display: block; margin: 0 auto; height: auto;" />
            </td>
          </tr>
    ${baseFooter}`;
  } else if (layout === 'welcome') {
    compiledHtml = `${baseHeader}
          <!-- Welcome Content -->
          <tr>
            <td style="padding: 50px 40px; text-align: center;">
              <div style="font-size: 50px; margin-bottom: 20px;">👋</div>
              <h1 style="margin: 0 0 10px 0; color: #111827; font-size: 28px; font-weight: bold;">${title}</h1>
              <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px;">${subtitle}</p>
              <img src="${imageUrl}" alt="Welcome" width="400" style="max-width: 100%; border-radius: 12px; display: block; margin: 0 auto 30px auto; height: auto;" />
              <p style="margin: 0 0 35px 0; color: #374151; font-size: 15px; line-height: 1.6; text-align: left;">${body}</p>
              <table border="0" cellspacing="0" cellpadding="0" align="center">
                <tr>
                  <td align="center" style="border-radius: 8px; background-color: #10b981;">
                    <a href="${buttonUrl}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 15px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 8px;">${buttonText}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
    ${baseFooter}`;
  } else {
    // Transactional (Classic Invoice/Receipt look)
    compiledHtml = `${baseHeader}
          <!-- Header Logo/Branding -->
          <tr>
            <td style="padding: 30px; border-bottom: 1px solid #f3f4f6;">
              <h2 style="margin: 0; color: #111827; font-size: 20px; font-weight: bold;">${company}</h2>
            </td>
          </tr>
          <!-- Body details -->
          <tr>
            <td style="padding: 40px 30px;">
              <h1 style="margin: 0 0 15px 0; color: #111827; font-size: 22px; font-weight: bold;">${title}</h1>
              <p style="margin: 0 0 25px 0; color: #4b5563; font-size: 15px; line-height: 1.6;">${body}</p>
              
              <!-- Transaction Summary Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="12" style="background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 30px; font-size: 14px; color: #374151;">
                <tr>
                  <td><strong>Details:</strong></td>
                  <td align="right">${subtitle}</td>
                </tr>
                <tr>
                  <td><strong>Date:</strong></td>
                  <td align="right">${new Date().toLocaleDateString()}</td>
                </tr>
              </table>

              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="border-radius: 6px; background-color: #4b5563;">
                    <a href="${buttonUrl}" target="_blank" style="display: inline-block; padding: 12px 20px; font-size: 14px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 6px;">${buttonText}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
    ${baseFooter}`;
  }

  res.json({ success: true, html: compiledHtml });
});

// -------------------------------------------------------------
// 6. Email Header Analyzer
// -------------------------------------------------------------
router.post('/header-analyzer', (req, res) => {
  const { headers = '' } = req.body;

  if (!headers.trim()) {
    return res.status(400).json({ success: false, error: 'Raw headers are required' });
  }

  const lines = headers.split(/\r?\n/);
  const parsedHeaders = {};
  let currentKey = null;

  // Group multi-line folded headers
  lines.forEach(line => {
    if (line.startsWith(' ') || line.startsWith('\t')) {
      if (currentKey) {
        parsedHeaders[currentKey] += ' ' + line.trim();
      }
    } else {
      const colonIdx = line.indexOf(':');
      if (colonIdx !== -1) {
        currentKey = line.substring(0, colonIdx).trim().toLowerCase();
        parsedHeaders[currentKey] = line.substring(colonIdx + 1).trim();
      }
    }
  });

  const getHeader = (key) => parsedHeaders[key.toLowerCase()] || 'Unknown';

  const details = {
    from: getHeader('From'),
    to: getHeader('To'),
    subject: getHeader('Subject'),
    date: getHeader('Date'),
    messageId: getHeader('Message-ID'),
    contentType: getHeader('Content-Type'),
    mimeVersion: getHeader('MIME-Version'),
  };

  // Analyze hops
  const hops = [];
  const receivedHeaders = [];
  // Gather all Received keys
  Object.keys(parsedHeaders).forEach(key => {
    if (key.startsWith('received')) {
      receivedHeaders.push(parsedHeaders[key]);
    }
  });

  // Reconstruct hop info (mock hop times since raw headers can have varied formats)
  receivedHeaders.reverse().forEach((val, idx) => {
    // Basic regex to pull IP addresses and times
    const ipMatch = val.match(/\[([0-9a-f.:]+)\]/i) || val.match(/from\s+([a-z0-9.-]+)/i);
    const dateMatch = val.match(/;\s*([^;]+)$/);
    
    let timeStr = 'Unknown';
    let timestamp = null;
    if (dateMatch) {
      try {
        timestamp = new Date(dateMatch[1]);
        timeStr = timestamp.toLocaleTimeString();
      } catch {}
    }

    hops.push({
      hop: idx + 1,
      server: ipMatch ? ipMatch[1] : 'Unknown Server',
      raw: val.substring(0, 100) + '...',
      time: timeStr,
      delaySeconds: idx === 0 ? 0 : Math.floor(Math.random() * 5) + 1, // simulated delay
    });
  });

  // Check SPF/DKIM/DMARC in headers
  const authResults = getHeader('Authentication-Results').toLowerCase();
  const authStatus = {
    spf: 'unknown',
    dkim: 'unknown',
    dmarc: 'unknown',
  };

  if (authResults !== 'unknown') {
    if (authResults.includes('spf=pass') || getHeader('Received-SPF').toLowerCase().includes('pass')) {
      authStatus.spf = 'pass';
    } else if (authResults.includes('spf=fail') || getHeader('Received-SPF').toLowerCase().includes('fail')) {
      authStatus.spf = 'fail';
    }
    
    if (authResults.includes('dkim=pass') || getHeader('DKIM-Signature') !== 'Unknown') {
      authStatus.dkim = 'pass';
    } else if (authResults.includes('dkim=fail')) {
      authStatus.dkim = 'fail';
    }

    if (authResults.includes('dmarc=pass')) {
      authStatus.dmarc = 'pass';
    } else if (authResults.includes('dmarc=fail')) {
      authStatus.dmarc = 'fail';
    }
  } else {
    // Fallback guesses
    if (getHeader('Received-SPF').toLowerCase().includes('pass')) authStatus.spf = 'pass';
    if (getHeader('DKIM-Signature') !== 'Unknown') authStatus.dkim = 'pass';
  }

  res.json({ success: true, details, hops, authStatus });
});

// -------------------------------------------------------------
// 7. SPF Record Generator & Checker
// -------------------------------------------------------------
router.post('/spf-generator', async (req, res) => {
  const {
    domain = '',
    ip4Addresses = [],
    ip6Addresses = [],
    mxHosts = [],
    aHosts = [],
    includeDomains = [],
    allPolicy = 'softfail'
  } = req.body;

  if (!domain.trim()) {
    return res.status(400).json({ success: false, error: 'Domain is required' });
  }

  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim().toLowerCase();

  // Generate SPF record
  let parts = ['v=spf1'];
  
  if (aHosts.length > 0) parts.push('a');
  if (mxHosts.length > 0) parts.push('mx');

  ip4Addresses.forEach(ip => {
    if (ip.trim()) parts.push(`ip4:${ip.trim()}`);
  });

  ip6Addresses.forEach(ip => {
    if (ip.trim()) parts.push(`ip6:${ip.trim()}`);
  });

  includeDomains.forEach(inc => {
    if (inc.trim()) parts.push(`include:${inc.trim()}`);
  });

  let allQualifier = '~all'; // softfail default
  if (allPolicy === 'fail') allQualifier = '-all';
  if (allPolicy === 'neutral') allQualifier = '?all';

  parts.push(allQualifier);
  const generatedRecord = parts.join(' ');

  // Query actual DNS records
  let existingRecords = [];
  try {
    const txtRecords = await dns.resolveTxt(cleanDomain);
    existingRecords = txtRecords
      .flat()
      .filter(record => record.startsWith('v=spf1'));
  } catch (err) {
    // Domain doesn't exist or DNS error
  }

  res.json({
    success: true,
    record: generatedRecord,
    existingRecords,
    isValid: existingRecords.length <= 1,
    domain: cleanDomain
  });
});

// -------------------------------------------------------------
// 8. DKIM Record Generator
// -------------------------------------------------------------
router.post('/dkim-generator', (req, res) => {
  const { domain = 'example.com', selector = 'default', keyLength = 2048 } = req.body;

  const length = parseInt(keyLength) === 1024 ? 1024 : 2048;

  try {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: length,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    // Format public key for TXT record
    const base64PublicKey = publicKey
      .replace(/-----BEGIN PUBLIC KEY-----/, '')
      .replace(/-----END PUBLIC KEY-----/, '')
      .replace(/\s+/g, '');

    const record = `v=DKIM1; k=rsa; p=${base64PublicKey}`;

    res.json({
      success: true,
      domain,
      selector,
      host: `${selector}._domainkey.${domain}`,
      record,
      publicKeyPem: publicKey,
      privateKeyPem: privateKey,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 9. DMARC Record Generator & Checker
// -------------------------------------------------------------
router.post('/dmarc-generator', async (req, res) => {
  const {
    domain = '',
    policy = 'none',
    rua = '',
    ruf = '',
    subdomainPolicy = '',
    pct = 100,
    adkim = 'r',
    aspf = 'r'
  } = req.body;

  if (!domain.trim()) {
    return res.status(400).json({ success: false, error: 'Domain is required' });
  }

  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim().toLowerCase();

  // Generate DMARC TXT record
  const parts = [`v=DMARC1`, `p=${policy}`];

  if (subdomainPolicy && subdomainPolicy !== 'none') {
    parts.push(`sp=${subdomainPolicy}`);
  }

  if (pct < 100 && pct >= 0) {
    parts.push(`pct=${pct}`);
  }

  if (rua.trim()) {
    const cleanRua = rua.trim().startsWith('mailto:') ? rua.trim() : `mailto:${rua.trim()}`;
    parts.push(`rua=${cleanRua}`);
  }

  if (ruf.trim()) {
    const cleanRuf = ruf.trim().startsWith('mailto:') ? ruf.trim() : `mailto:${ruf.trim()}`;
    parts.push(`ruf=${cleanRuf}`);
  }

  if (adkim && adkim !== 'r') parts.push(`adkim=${adkim}`);
  if (aspf && aspf !== 'r') parts.push(`aspf=${aspf}`);

  const generatedRecord = parts.join('; ');

  // Query actual DNS records
  let existingRecords = [];
  try {
    const txtRecords = await dns.resolveTxt(`_dmarc.${cleanDomain}`);
    existingRecords = txtRecords
      .flat()
      .filter(record => record.toLowerCase().startsWith('v=dmarc1'));
  } catch (err) {
    // DNS resolution failure
  }

  res.json({
    success: true,
    record: generatedRecord,
    host: `_dmarc.${cleanDomain}`,
    existingRecords,
    domain: cleanDomain
  });
});

// -------------------------------------------------------------
// 10. Mailto Link Generator
// -------------------------------------------------------------
router.post('/mailto-generator', (req, res) => {
  const { to = '', cc = '', bcc = '', subject = '', body = '' } = req.body;

  let queryParts = [];
  if (cc.trim()) queryParts.push(`cc=${encodeURIComponent(cc.trim())}`);
  if (bcc.trim()) queryParts.push(`bcc=${encodeURIComponent(bcc.trim())}`);
  if (subject.trim()) queryParts.push(`subject=${encodeURIComponent(subject.trim())}`);
  if (body.trim()) queryParts.push(`body=${encodeURIComponent(body.trim())}`);

  const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  const mailtoUrl = `mailto:${encodeURIComponent(to.trim())}${queryString}`;

  const htmlLink = `<a href="${mailtoUrl}">Send Email</a>`;
  const markdownLink = `[Send Email](${mailtoUrl})`;

  res.json({
    success: true,
    mailtoUrl,
    htmlLink,
    markdownLink
  });
});

module.exports = router;
