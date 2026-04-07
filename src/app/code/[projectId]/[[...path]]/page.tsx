import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Folder, FileCode, ArrowLeft, TerminalSquare } from 'lucide-react';

export const metadata = {
  title: 'Code Viewer | MIMO-NDI',
};

// Recursive function to build a file tree
function getFileTree(dir: string, baseRoute: string, subPath: string = ''): any[] {
  if (!fs.existsSync(dir)) return [];
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const nodes = entries.map(entry => {
    const relativePath = path.posix.join(subPath, entry.name);
    
    if (entry.isDirectory()) {
      return {
        name: entry.name,
        type: 'directory',
        path: relativePath,
        children: getFileTree(path.join(dir, entry.name), baseRoute, relativePath)
      };
    } else {
      return {
        name: entry.name,
        type: 'file',
        path: relativePath
      };
    }
  });

  // Sort: directories first
  return nodes.sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === 'directory' ? -1 : 1;
  });
}

function renderTree(nodes: any[], baseRoute: string, currentPath: string) {
  return (
    <ul style={{ listStyle: 'none', paddingLeft: '1rem', margin: '0.2rem 0' }}>
      {nodes.map(node => {
        const isSelected = currentPath === node.path;
        
        if (node.type === 'directory') {
          return (
            <li key={node.path} style={{ margin: '0.3rem 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                <Folder size={14} color="var(--accent-orange)" />
                <span>{node.name}</span>
              </div>
              {renderTree(node.children, baseRoute, currentPath)}
            </li>
          );
        }

        return (
          <li key={node.path} style={{ margin: '0.3rem 0' }}>
            <Link 
              href={`/code/${baseRoute}/${node.path}`}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', 
                fontSize: '0.85rem', textDecoration: 'none',
                color: isSelected ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                background: isSelected ? 'rgba(0,229,255,0.05)' : 'transparent',
                padding: '0.2rem 0.5rem', borderRadius: '4px',marginLeft: '-0.5rem',
                borderLeft: isSelected ? '2px solid var(--accent-cyan)' : '2px solid transparent'
              }}
            >
              <FileCode size={13} color={isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
              <span>{node.name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function CodeViewerPage(props: { params: { projectId: string; path?: string[] } }) {
  const { projectId, path: pathArray } = props.params;

  // Map project IDs to their respective code directories
  const projectDirs: Record<string, string> = {
    'mimo-spark': path.join(/* turbopackIgnore: true */ process.cwd(), 'src/data/projects_code/spark'),
    'mimo-ndi-ios': path.join(/* turbopackIgnore: true */ process.cwd(), 'src/data/projects_code/iphone'),
    'booking-system': path.join(/* turbopackIgnore: true */ process.cwd(), 'src'),
  };

  const codeDir = projectDirs[projectId];
  if (!codeDir || !fs.existsSync(codeDir)) {
    notFound();
  }

  const currentPathArray = pathArray || [];
  let fileContent = '';
  let selectedFilePath = '';
  let activeFileName = 'Sélectionnez un fichier';
  let isTooLarge = false;

  // Resolve the requested file path safely
  if (currentPathArray.length > 0) {
    const targetPath = path.join(codeDir, ...currentPathArray);
    
    // Security check logic here in prod (e.g. ensure targetPath is within codeDir)
    if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
      selectedFilePath = currentPathArray.join('/');
      activeFileName = currentPathArray[currentPathArray.length - 1];
      
      const stats = fs.statSync(targetPath);
      if (stats.size > 200 * 1024) { // Don't load files exactly above 200KB synchronously for safety
        isTooLarge = true;
        fileContent = `// Le fichier ${activeFileName} est très volumineux (${(stats.size/1024).toFixed(0)} KB).\n// Tronqué pour des raisons de performance d'affichage.\n\n`;
        const buffer = Buffer.alloc(100 * 1024);
        const fd = fs.openSync(targetPath, 'r');
        fs.readSync(fd, buffer, 0, 100 * 1024, 0);
        fs.closeSync(fd);
        fileContent += buffer.toString('utf-8');
      } else {
        fileContent = fs.readFileSync(targetPath, 'utf-8');
      }
    }
  } else {
    fileContent = `// Bienvenue sur l'explorateur de code MIMO-NDI\n// Sélectionnez un fichier dans l'arborescence à gauche pour visualiser le code source.`;
  }

  const tree = getFileTree(codeDir, projectId);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, display: 'flex', background: 'var(--bg)', color: 'var(--text-primary)', overflow: 'hidden' }}>
      
      {/* Sidebar File Explorer */}
      <div style={{ width: '280px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.01)' }}>
        
        {/* Header */}
        <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <Link href="/#projets" className="btn btn-outline" style={{ width: 'fit-content', padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
            <ArrowLeft size={14} /> Retour au portfolio
          </Link>
          <div>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TerminalSquare size={16} color="var(--accent-purple)" />
              {projectId}
            </h2>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Explorateur de repository local</p>
          </div>
        </div>

        {/* Tree View */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.5rem', fontFamily: 'var(--font-geist-mono), monospace' }}>
          {renderTree(tree, projectId, selectedFilePath)}
        </div>
      </div>

      {/* Main Code View */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Editor Tabs bar */}
        <div style={{ height: '40px', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg)', borderTop: '2px solid var(--accent-cyan)', padding: '0.4rem 1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <FileCode size={13} color="var(--accent-cyan)" />
            {activeFileName}
          </div>
        </div>

        {/* Code Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '1rem', background: '#0a0a0a' }}>
          <pre style={{ margin: 0 }}>
            <code style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.85rem', lineHeight: 1.6, color: '#e5e7eb', whiteSpace: 'pre-wrap' }}>
              {fileContent}
            </code>
          </pre>
        </div>
        
      </div>
    </div>
  );
}
