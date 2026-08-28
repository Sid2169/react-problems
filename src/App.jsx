import React, { useState, useEffect, useMemo, Component } from 'react';
import { 
  Folder, 
  FileCode, 
  Play, 
  Code2, 
  Sparkles, 
  ChevronRight, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  BookOpen,
  Box
} from 'lucide-react';

// Robust Error Boundary to catch render-time errors in solution components
class ComponentErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error rendering solution component:", error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-card">
          <div className="error-header">
            <AlertTriangle className="error-icon" size={20} />
            <h3>Runtime Component Error</h3>
          </div>
          <p className="error-message">{this.state.error?.toString()}</p>
          <pre className="error-stack">{this.state.error?.stack}</pre>
          <button 
            className="btn-retry"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            <RefreshCw size={14} /> Retry Rendering
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Auto-discover all Solution.jsx files anywhere in the repo (relative to src/)
const rawModules = import.meta.glob(
  [
    '../01-describing-ui/**/[sS]olution*.{jsx,tsx}',
    '../02-adding-interactivity/**/[sS]olution*.{jsx,tsx}',
    '../03-managing-state/**/[sS]olution*.{jsx,tsx}',
    '../04-escape-hatches/**/[sS]olution*.{jsx,tsx}',
    '../**/[sS]olution*.{jsx,tsx}'
  ],
  { eager: true }
);

function formatTitle(str) {
  return str
    .replace(/^\d+-/, '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function parseModulePath(path) {
  // Format: ../01-describing-ui/01-first-component/Solution.jsx
  const cleanPath = path.replace(/^(\.\.\/|\.\/)/, '');
  const parts = cleanPath.split('/');
  if (parts.length < 3) return null;

  const categoryDir = parts[0];
  const topicDir = parts[1];
  const filename = parts[parts.length - 1];

  const categoryName = categoryDir.replace(/^\d+-/, '').split('-').map(w => w.toUpperCase()).join(' ');
  const topicName = formatTitle(topicDir);

  return {
    rawPath: cleanPath,
    categoryDir,
    categoryName,
    topicDir,
    topicName,
    filename
  };
}

export default function App() {
  // Organize solutions by category and topic
  const solutionTree = useMemo(() => {
    const categories = {};

    Object.keys(rawModules).forEach(path => {
      const parsed = parseModulePath(path);
      if (!parsed) return;

      const { categoryDir, categoryName, topicDir, topicName } = parsed;
      const mod = rawModules[path];

      // Filter exported components from module
      const exports = [];
      Object.keys(mod).forEach(exportName => {
        const exportedItem = mod[exportName];
        if (typeof exportedItem === 'function') {
          exports.push({
            name: exportName === 'default' ? 'Default Component (Main)' : exportName,
            isDefault: exportName === 'default',
            component: exportedItem
          });
        }
      });

      if (!categories[categoryDir]) {
        categories[categoryDir] = {
          name: categoryName,
          dir: categoryDir,
          topics: []
        };
      }

      categories[categoryDir].topics.push({
        dir: topicDir,
        name: topicName,
        path,
        exports,
        notes: mod.answers || mod.notes || mod.metadata || null
      });
    });

    return Object.values(categories);
  }, []);

  // Active selection states
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedExport, setSelectedExport] = useState(null);

  // Default selection on load
  useEffect(() => {
    if (solutionTree.length > 0) {
      const firstCat = solutionTree[0];
      setSelectedCategory(firstCat.dir);
      if (firstCat.topics.length > 0) {
        const firstTopic = firstCat.topics[0];
        setSelectedTopic(firstTopic.path);
        if (firstTopic.exports.length > 0) {
          setSelectedExport(firstTopic.exports[0].name);
        }
      }
    }
  }, [solutionTree]);

  const activeCategoryObj = useMemo(() => {
    return solutionTree.find(c => c.dir === selectedCategory);
  }, [solutionTree, selectedCategory]);

  const activeTopicObj = useMemo(() => {
    if (!activeCategoryObj) return null;
    return activeCategoryObj.topics.find(t => t.path === selectedTopic);
  }, [activeCategoryObj, selectedTopic]);

  const activeExportObj = useMemo(() => {
    if (!activeTopicObj) return null;
    return activeTopicObj.exports.find(e => e.name === selectedExport) || activeTopicObj.exports[0];
  }, [activeTopicObj, selectedExport]);

  return (
    <div className="workbench-layout">
      {/* Header */}
      <header className="workbench-header">
        <div className="logo-section">
          <div className="logo-badge">
            <Sparkles size={18} />
          </div>
          <div>
            <h1>React Problems Workbench</h1>
            <p className="subtitle">Single-File Solution Runner & Auto-Discovery</p>
          </div>
        </div>

        <div className="header-meta">
          <div className="stat-chip">
            <Box size={14} />
            <span>{solutionTree.flatMap(c => c.topics).length} Solutions Found</span>
          </div>
        </div>
      </header>

      <div className="workbench-body">
        {/* Sidebar */}
        <aside className="workbench-sidebar">
          <div className="sidebar-section-title">
            <BookOpen size={14} />
            <span>CATEGORIES</span>
          </div>

          <nav className="nav-categories">
            {solutionTree.map(cat => (
              <div key={cat.dir} className="category-group">
                <button
                  className={`category-btn ${selectedCategory === cat.dir ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(cat.dir);
                    if (cat.topics.length > 0) {
                      setSelectedTopic(cat.topics[0].path);
                      if (cat.topics[0].exports.length > 0) {
                        setSelectedExport(cat.topics[0].exports[0].name);
                      }
                    }
                  }}
                >
                  <Folder size={16} />
                  <span className="cat-name">{cat.name}</span>
                  <span className="cat-badge">{cat.topics.length}</span>
                </button>

                {selectedCategory === cat.dir && (
                  <div className="topics-list">
                    {cat.topics.map(topic => (
                      <button
                        key={topic.path}
                        className={`topic-btn ${selectedTopic === topic.path ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedTopic(topic.path);
                          if (topic.exports.length > 0) {
                            setSelectedExport(topic.exports[0].name);
                          }
                        }}
                      >
                        <FileCode size={14} />
                        <span>{topic.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {solutionTree.length === 0 && (
              <div className="empty-sidebar-notice">
                <AlertTriangle size={18} />
                <p>No `Solution.jsx` files found yet.</p>
                <small>Create `Solution.jsx` inside any problem directory to see it here!</small>
              </div>
            )}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="workbench-main">
          {activeTopicObj ? (
            <div className="topic-container">
              {/* Topic Breadcrumb & Header */}
              <div className="topic-bar">
                <div className="breadcrumb">
                  <span>{activeCategoryObj?.name}</span>
                  <ChevronRight size={14} />
                  <strong className="current-topic">{activeTopicObj.name}</strong>
                </div>
                <div className="file-path-tag">
                  <code>{activeTopicObj.path}</code>
                </div>
              </div>

              {/* Exercise / Component Selector Tabs */}
              <div className="exports-bar">
                <div className="exports-label">
                  <Layers size={15} />
                  <span>Exported Exercises:</span>
                </div>
                <div className="exports-tabs">
                  {activeTopicObj.exports.map(exp => (
                    <button
                      key={exp.name}
                      className={`tab-btn ${selectedExport === exp.name ? 'active' : ''}`}
                      onClick={() => setSelectedExport(exp.name)}
                    >
                      <Play size={12} className="play-icon" />
                      <span>{exp.name}</span>
                    </button>
                  ))}
                  {activeTopicObj.exports.length === 0 && (
                    <span className="no-exports-msg">No exported components found in this solution file.</span>
                  )}
                </div>
              </div>

              {/* Render Canvas */}
              <div className="preview-stage">
                <div className="stage-header">
                  <div className="stage-title">
                    <CheckCircle2 size={16} className="text-success" />
                    <span>Live Render Canvas — <strong>{selectedExport}</strong></span>
                  </div>
                </div>

                <div className="stage-viewport">
                  {activeExportObj?.component ? (
                    <ComponentErrorBoundary resetKey={`${selectedTopic}-${selectedExport}`}>
                      <div className="rendered-component-wrapper">
                        {React.createElement(activeExportObj.component)}
                      </div>
                    </ComponentErrorBoundary>
                  ) : (
                    <div className="empty-viewport">
                      <Code2 size={32} />
                      <p>Select an exercise component above to run its live output.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Solution Notes / Text Answers if available */}
              {activeTopicObj.notes && (
                <div className="notes-card">
                  <h3>Written / Conceptual Answers</h3>
                  <pre>{JSON.stringify(activeTopicObj.notes, null, 2)}</pre>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state">
              <Sparkles size={48} />
              <h2>Welcome to React Practice Workbench</h2>
              <p>Create a <code>Solution.jsx</code> file inside any topic folder to run your code!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
