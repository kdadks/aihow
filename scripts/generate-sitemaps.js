#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = 'https://how2doai.com';
const currentDate = new Date().toISOString().split('T')[0];

// AI-focused keywords for URL generation
const aiKeywords = [
  'chatgpt-alternatives',
  'copilot-tools',
  'ai-automation',
  'agentic-ai',
  'workflow-automation',
  'ai-productivity',
  'machine-learning-tools',
  'ai-assistants',
  'ai-platforms'
];

// Generate dynamic sitemap entries for AI keywords
function generateAISitemap() {
  const urls = aiKeywords.map(keyword => `
  <url>
    <loc>${baseUrl}/${keyword}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- AI Keywords Sitemap -->
  ${urls}
</urlset>`;
}

// Update main sitemap index
function updateSitemapIndex() {
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main Sitemap -->
  <sitemap>
    <loc>${baseUrl}/sitemap-main.xml</loc>
    <lastmod>${currentDate}T10:00:00+00:00</lastmod>
  </sitemap>

  <!-- Tools Sitemap -->
  <sitemap>
    <loc>${baseUrl}/sitemap-tools.xml</loc>
    <lastmod>${currentDate}T10:00:00+00:00</lastmod>
  </sitemap>

  <!-- Reviews Sitemap -->
  <sitemap>
    <loc>${baseUrl}/sitemap-reviews.xml</loc>
    <lastmod>${currentDate}T10:00:00+00:00</lastmod>
  </sitemap>

  <!-- Blog Sitemap -->
  <sitemap>
    <loc>${baseUrl}/sitemap-blog.xml</loc>
    <lastmod>${currentDate}T10:00:00+00:00</lastmod>
  </sitemap>

  <!-- AI Keywords Sitemap -->
  <sitemap>
    <loc>${baseUrl}/sitemap-ai-keywords.xml</loc>
    <lastmod>${currentDate}T10:00:00+00:00</lastmod>
  </sitemap>
</sitemapindex>`;

  return sitemapIndex;
}

// Generate sitemaps
const publicDir = path.join(__dirname, '..', 'public');

// Generate AI keywords sitemap
const aiSitemap = generateAISitemap();
fs.writeFileSync(path.join(publicDir, 'sitemap-ai-keywords.xml'), aiSitemap);

// Update main sitemap index
const updatedIndex = updateSitemapIndex();
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), updatedIndex);

console.log('✅ AI-focused sitemaps generated successfully!');
console.log('📄 Files updated:');
console.log('  - sitemap.xml (updated index)');
console.log('  - sitemap-ai-keywords.xml (new AI keywords sitemap)');
