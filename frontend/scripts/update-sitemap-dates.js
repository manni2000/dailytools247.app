#!/usr/bin/env node

/**
 * Updates sitemap lastmod dates — but only for URLs whose underlying content
 * actually changed. Previously this blindly stamped every URL in every sitemap
 * with today's date on every build, which made Google distrust the freshness
 * signal (all 168+ tool pages always showed an identical, same-day lastmod
 * regardless of whether anything changed).
 *
 * Run this before building: node scripts/update-sitemap-dates.js
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const currentDate = new Date().toISOString().split('T')[0];

// Shared data files whose changes affect many pages at once.
const TOOL_SHARED_FILES = [
  'src/data/toolSeoEnhancements.ts',
  'src/data/toolCategories.ts',
];
const CATEGORY_SHARED_FILES = [
  'src/pages/CategoryPage.tsx',
  'src/data/toolCategories.ts',
  'src/data/categorySpecificFaqs.ts',
];
const BLOG_SHARED_FILES = [
  'src/data/blogPosts.ts',
  'src/pages/blog/BlogPostPage.tsx',
];
const STATIC_PAGE_FILES = {
  '/': ['src/pages/Index.tsx'],
  '/categories': ['src/pages/CategoriesPage.tsx'],
  '/about': ['src/pages/About.tsx'],
  '/write-for-us': ['src/pages/WriteForUs.tsx'],
  '/privacy': ['src/pages/PrivacyPolicy.tsx'],
  '/terms': ['src/pages/TermsOfService.tsx'],
  '/api-docs': ['src/pages/APIDocs.tsx'],
  '/blogs': ['src/pages/blog/BlogListPage.tsx', ...BLOG_SHARED_FILES],
};

// Returns YYYY-MM-DD of the most recent commit touching any of the given
// files (relative to projectRoot), or null if none are tracked/changed yet.
function latestGitDate(relFiles) {
  let latest = null;
  for (const relFile of relFiles) {
    const fullPath = path.join(projectRoot, relFile);
    if (!fs.existsSync(fullPath)) continue;
    try {
      const out = execSync(`git log -1 --format=%cd --date=short -- "${relFile}"`, {
        cwd: projectRoot,
        encoding: 'utf8'
      }).trim();
      if (out && (!latest || out > latest)) latest = out;
    } catch {
      // Not a git repo / file not tracked yet — ignore.
    }
  }
  return latest;
}

// Builds route -> [source files] map for tool pages by reading the lazy
// import + Route path pairs out of App.tsx.
function buildToolRouteFileMap() {
  const appTsx = fs.readFileSync(path.join(projectRoot, 'src/App.tsx'), 'utf8');
  const compToFile = {};
  const importRe = /const (\w+) = lazy\(\(\) => import\("(\.\/pages\/[^"]+)"\)\);/g;
  let m;
  while ((m = importRe.exec(appTsx))) {
    compToFile[m[1]] = m[2].replace(/^\.\//, 'src/') + '.tsx';
  }
  const routeToFile = {};
  const routeRe = /<Route\s+path="([^"]+)"\s+element=\{<(\w+)[\s\S]{0,5}?\/>\}/g;
  while ((m = routeRe.exec(appTsx))) {
    const file = compToFile[m[2]];
    if (file) routeToFile[m[1]] = file;
  }
  return routeToFile;
}

function updateUrlSet(filePath, resolveFilesForLoc) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${path.relative(projectRoot, filePath)}`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let changedCount = 0;

  content = content.replace(
    /<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/g,
    (fullMatch, loc, existingDate) => {
      const relFiles = resolveFilesForLoc(loc);
      const gitDate = relFiles ? latestGitDate(relFiles) : null;
      const newDate = gitDate && gitDate > existingDate ? gitDate : existingDate;
      if (newDate !== existingDate) changedCount++;
      return fullMatch.replace(`<lastmod>${existingDate}</lastmod>`, `<lastmod>${newDate}</lastmod>`);
    }
  );

  fs.writeFileSync(filePath, content);
  console.log(`✅ ${path.relative(projectRoot, filePath)}: ${changedCount} URL(s) had a real content update`);
  return changedCount > 0;
}

function main() {
  const toolRouteFileMap = buildToolRouteFileMap();

  const toolsChanged = updateUrlSet(
    path.join(projectRoot, 'public/sitemap-tools.xml'),
    (loc) => {
      const pathname = new URL(loc).pathname;
      const file = toolRouteFileMap[pathname];
      return file ? [file, ...TOOL_SHARED_FILES] : TOOL_SHARED_FILES;
    }
  );

  const pagesChanged = updateUrlSet(
    path.join(projectRoot, 'public/sitemap-pages.xml'),
    (loc) => {
      const pathname = new URL(loc).pathname;
      if (STATIC_PAGE_FILES[pathname]) return STATIC_PAGE_FILES[pathname];
      if (pathname.startsWith('/category/')) return CATEGORY_SHARED_FILES;
      return null;
    }
  );

  const blogChanged = updateUrlSet(
    path.join(projectRoot, 'public/sitemap-blog.xml'),
    (loc) => {
      const pathname = new URL(loc).pathname;
      if (pathname === '/blogs') return STATIC_PAGE_FILES['/blogs'];
      return BLOG_SHARED_FILES;
    }
  );

  // The sitemap index's own lastmod should only move when the child sitemap
  // it points to actually changed in this run.
  const indexPath = path.join(projectRoot, 'public/sitemap.xml');
  if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    const childChanged = {
      'sitemap-pages.xml': pagesChanged,
      'sitemap-tools.xml': toolsChanged,
      'sitemap-blog.xml': blogChanged,
    };
    indexContent = indexContent.replace(
      /<sitemap>\s*<loc>([^<]+)<\/loc>\s*<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>\s*<\/sitemap>/g,
      (fullMatch, loc, existingDate) => {
        const fileName = loc.split('/').pop();
        if (!childChanged[fileName]) return fullMatch;
        return fullMatch.replace(`<lastmod>${existingDate}</lastmod>`, `<lastmod>${currentDate}</lastmod>`);
      }
    );
    fs.writeFileSync(indexPath, indexContent);
    console.log(`✅ ${path.relative(projectRoot, indexPath)}: updated to reflect changed child sitemaps`);
  }

  console.log('\n✨ Sitemap lastmod dates reflect actual content changes only.');
}

main();
