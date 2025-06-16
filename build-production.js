#!/usr/bin/env node

/**
 * Production Build Script for CNC Coffee N Cravings
 * Optimizes the build for deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting production build for CNC Coffee N Cravings...\n');

// Clean previous build
console.log('🧹 Cleaning previous build...');
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true });
}

// Run build
console.log('📦 Building application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully!\n');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Create deployment files
console.log('📄 Creating deployment files...');

// Create _redirects file for SPA routing (Netlify/Vercel)
const redirectsContent = `/*    /index.html   200`;
fs.writeFileSync(path.join('dist', '_redirects'), redirectsContent);

// Create robots.txt
const robotsContent = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://cnc-coffee-cravings.vercel.app/sitemap.xml

# Disallow admin routes from crawling
User-agent: *
Disallow: /admin/
`;
fs.writeFileSync(path.join('dist', 'robots.txt'), robotsContent);

// Create sitemap.xml
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://cnc-coffee-cravings.vercel.app/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://cnc-coffee-cravings.vercel.app/menu</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://cnc-coffee-cravings.vercel.app/events</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://cnc-coffee-cravings.vercel.app/gallery</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://cnc-coffee-cravings.vercel.app/our-story</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://cnc-coffee-cravings.vercel.app/customer-stories</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://cnc-coffee-cravings.vercel.app/contact</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://cnc-coffee-cravings.vercel.app/faq</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://cnc-coffee-cravings.vercel.app/reservation</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;
fs.writeFileSync(path.join('dist', 'sitemap.xml'), sitemapContent);

// Build summary
console.log('📊 Build Summary:');
const distStats = fs.readdirSync('dist');
distStats.forEach(file => {
  const filePath = path.join('dist', file);
  const stats = fs.statSync(filePath);
  if (stats.isFile()) {
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`   ${file}: ${sizeKB} KB`);
  }
});

console.log('\n✅ Production build ready for deployment!');
console.log('📁 Build output: ./dist/');
console.log('🌐 Deploy to: Vercel, Netlify, or any static hosting');
console.log('\n🎉 CNC Coffee N Cravings is ready to serve Jaipur!');
