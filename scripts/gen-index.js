import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Scan target directories for articles
const targetDirs = [
  path.join(rootDir, 'src', 'content', 'posts'),
  path.join(rootDir, 'src', 'pages'),
];

// Recursively find .md and .mdx files
function findMarkdownFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.astro') {
        findMarkdownFiles(fullPath, fileList);
      }
    } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

// Parse YAML frontmatter
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const yamlBlock = match[1];

  const data = {};

  // Extract title
  const titleMatch = yamlBlock.match(/^title:\s*["']?(.*?)["']?$/m);
  if (titleMatch) data.title = titleMatch[1].trim();

  // Extract pubDate or date
  const dateMatch = yamlBlock.match(/^(?:pubDate|date):\s*["']?([\d-]+(?:T[\d:Z+-]+)?)["']?$/m);
  if (dateMatch) {
    data.date = dateMatch[1].trim().split('T')[0];
  }

  // Extract description
  const descMatch = yamlBlock.match(/^description:\s*["']?(.*?)["']?$/m);
  if (descMatch) data.description = descMatch[1].trim();

  // Extract category
  const catMatch = yamlBlock.match(/^category:\s*["']?(.*?)["']?$/m);
  if (catMatch) data.category = catMatch[1].trim();

  // Extract tags or keywords
  const tagsInlineMatch = yamlBlock.match(/^(?:tags|keywords):\s*\[(.*?)\]/m);
  if (tagsInlineMatch) {
    data.tags = tagsInlineMatch[1]
      .split(',')
      .map(t => t.trim().replace(/^["']|["']$/g, ''))
      .filter(Boolean);
  } else {
    const tagsListMatch = yamlBlock.match(/^(?:tags|keywords):\s*\r?\n((?:\s*-\s*.*\r?\n?)+)/m);
    if (tagsListMatch) {
      data.tags = tagsListMatch[1]
        .split('\n')
        .map(line => line.replace(/^\s*-\s*/, '').trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    } else {
      data.tags = [];
    }
  }

  return data;
}

// Get URL slug
function getUrlSlug(filePath) {
  const relPath = path.relative(rootDir, filePath).replace(/\\/g, '/');
  if (relPath.startsWith('src/content/posts/')) {
    const baseName = path.basename(filePath, path.extname(filePath));
    return `/posts/${baseName}/`;
  }
  if (relPath.startsWith('src/pages/')) {
    let sub = relPath.replace(/^src\/pages\//, '').replace(/\.(md|mdx)$/, '');
    if (sub.endsWith('/index')) sub = sub.slice(0, -6);
    return `/${sub}/`.replace(/\/+/g, '/');
  }
  const baseName = path.basename(filePath, path.extname(filePath));
  return `/posts/${baseName}/`;
}

function generateIndex() {
  const allFiles = [];
  const scannedPaths = new Set();

  for (const dir of targetDirs) {
    const files = findMarkdownFiles(dir);
    for (const f of files) {
      if (!scannedPaths.has(f)) {
        scannedPaths.add(f);
        allFiles.push(f);
      }
    }
  }

  const articles = [];

  for (const filePath of allFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const meta = parseFrontmatter(content);
    if (meta && meta.title) {
      articles.push({
        title: meta.title,
        date: meta.date || '1970-01-01',
        url: getUrlSlug(filePath),
        tags: meta.tags || [],
        category: meta.category || 'default',
        filePath: path.relative(rootDir, filePath).replace(/\\/g, '/'),
      });
    }
  }

  // Sort descending by date
  articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Generate CONTENT_INDEX.md
  let output = `# CONTENT_INDEX.md - 云机场 (yunjichang.vip) 全站文章索引\n\n`;
  output += `> 本文件由脚本 \`scripts/gen-index.js\` 自动维护。每次新增、更新文章后必须重新执行该脚本更新索引。\n`;
  output += `> 统计：当前收录文章共 **${articles.length}** 篇 | 最后索引时间：${new Date().toISOString().split('T')[0]}\n\n`;
  output += `## 📚 全站文章索引清单（按发布日期倒序）\n\n`;

  for (const item of articles) {
    const tagStr = item.tags.length > 0 ? item.tags.join(', ') : '通用';
    output += `- [${item.date}] [${item.title}](${item.url}) | 关键词: ${tagStr}\n`;
  }

  output += `\n---\n`;
  output += `\n### 维护规范提示\n`;
  output += `- **新文章查重**：撰写前必须比对上方文章标题与关键词，严禁同质化堆砌。\n`;
  output += `- **内链闭环**：撰写新文章时必须引用上方 2~3 篇关联文章的相对路径，并在发布后回链。\n`;
  output += `- **索引更新命令**：\`node scripts/gen-index.js\`\n`;

  const outputPath = path.join(rootDir, 'CONTENT_INDEX.md');
  fs.writeFileSync(outputPath, output, 'utf-8');

  console.log(`[gen-index] 成功扫描并提取 ${articles.length} 篇文章！`);
  console.log(`[gen-index] 索引已写入: ${outputPath}`);
}

generateIndex();
