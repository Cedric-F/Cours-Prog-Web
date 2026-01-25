import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface SearchResult {
  title: string;
  path: string;
  excerpt: string;
  axisId: string;
  chapterId: string;
  sectionId: string;
  subsectionId?: string;
}

// Récursively get all markdown files
function getMarkdownFiles(dir: string, basePath: string = ''): { filePath: string; relativePath: string }[] {
  const files: { filePath: string; relativePath: string }[] = [];
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.join(basePath, entry.name);
      
      if (entry.isDirectory()) {
        files.push(...getMarkdownFiles(fullPath, relPath));
      } else if (entry.name.endsWith('.md')) {
        files.push({ filePath: fullPath, relativePath: relPath });
      }
    }
  } catch (error) {
    console.error('Error reading directory:', error);
  }
  
  return files;
}

// Extract title from markdown content
function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1] : 'Sans titre';
}

// Parse relative path to get axis, chapter, section, subsection
function parseRelativePath(relativePath: string): { axisId: string; chapterId: string; sectionId: string; subsectionId?: string } | null {
  // Format: axis/chapter/section.md or axis/chapter/section/subsection.md
  const parts = relativePath.replace(/\\/g, '/').replace('.md', '').split('/');
  
  if (parts.length === 3) {
    return { axisId: parts[0], chapterId: parts[1], sectionId: parts[2] };
  } else if (parts.length === 4) {
    return { axisId: parts[0], chapterId: parts[1], sectionId: parts[2], subsectionId: parts[3] };
  }
  
  return null;
}

// Search in content and return excerpt
function searchInContent(content: string, query: string): string | null {
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  
  const index = lowerContent.indexOf(lowerQuery);
  if (index === -1) return null;
  
  // Get surrounding context (100 chars before and after)
  const start = Math.max(0, index - 100);
  const end = Math.min(content.length, index + query.length + 100);
  
  let excerpt = content.slice(start, end);
  
  // Clean up excerpt
  excerpt = excerpt.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  
  if (start > 0) excerpt = '...' + excerpt;
  if (end < content.length) excerpt = excerpt + '...';
  
  return excerpt;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  
  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }
  
  const contentDir = path.join(process.cwd(), 'public', 'content', 'dev-web');
  const markdownFiles = getMarkdownFiles(contentDir);
  
  const results: SearchResult[] = [];
  
  for (const { filePath, relativePath } of markdownFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const excerpt = searchInContent(content, query);
      
      if (excerpt) {
        const pathInfo = parseRelativePath(relativePath);
        if (pathInfo) {
          results.push({
            title: extractTitle(content),
            path: pathInfo.subsectionId 
              ? `/${pathInfo.axisId}/${pathInfo.chapterId}/${pathInfo.sectionId}/${pathInfo.subsectionId}`
              : `/${pathInfo.axisId}/${pathInfo.chapterId}/${pathInfo.sectionId}`,
            excerpt,
            ...pathInfo,
          });
        }
      }
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
    }
  }
  
  // Limit results
  return NextResponse.json({ results: results.slice(0, 20) });
}
