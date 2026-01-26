import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import structure from '@/data/structure.json';

interface SearchResult {
  title: string;
  path: string;
  excerpt: string;
}

// Build a map from file paths to URLs using structure.json
function buildFileToUrlMap(): Map<string, string> {
  const map = new Map<string, string>();
  
  for (const axis of structure.axes) {
    for (const chapter of axis.chapters) {
      for (const section of chapter.sections) {
        if (section.subsections && section.subsections.length > 0) {
          for (const subsection of section.subsections) {
            if (subsection.file) {
              map.set(subsection.file, `/${axis.id}/${chapter.id}/${section.id}/${subsection.id}`);
            }
          }
        } else if (section.file) {
          map.set(section.file, `/${axis.id}/${chapter.id}/${section.id}`);
        }
      }
    }
  }
  
  return map;
}

// Recursively get all markdown files
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
  const fileToUrlMap = buildFileToUrlMap();
  
  const results: SearchResult[] = [];
  
  for (const { filePath, relativePath } of markdownFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const excerpt = searchInContent(content, query);
      
      if (excerpt) {
        // Convert relativePath to the format used in structure.json
        const structurePath = 'dev-web/' + relativePath.replace(/\\/g, '/');
        const url = fileToUrlMap.get(structurePath);
        
        if (url) {
          results.push({
            title: extractTitle(content),
            path: url,
            excerpt,
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
