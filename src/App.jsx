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
  Circle,
  AlertTriangle,
  RefreshCw,
  BookOpen,
  Box,
  Copy,
  Check,
  PlusCircle
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

// 1. Discover all existing problem topics across the entire repository
const allProblemFiles = import.meta.glob('../0*/**/problems.md', { eager: true, query: '?raw' });

// 2. Discover all Solution.jsx files
const rawSolutionModules = import.meta.glob(
  [
    '../01-describing-ui/**/[sS]olution*.{jsx,tsx}',
    '../02-adding-interactivity/**/[sS]olution*.{jsx,tsx}',
    '../03-managing-state/**/[sS]olution*.{jsx,tsx}',
    '../04-escape-hatches/**/[sS]olution*.{jsx,tsx}'
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

function parseTopicPath(path) {
  // Format: ../01-describing-ui/01-first-component/problems.md
  const cleanPath = path.replace(/^(\.\.\/|\.\/)/, '');
  const parts = cleanPath.split('/');
  if (parts.length < 3) return null;

  const categoryDir = parts[0];
  const topicDir = parts[1];

  const categoryName = categoryDir.replace(/^\d+-/, '').split('-').map(w => w.toUpperCase()).join(' ');
  const topicName = formatTitle(topicDir);

  return {
    categoryDir,
    categoryName,
    topicDir,
    topicName,
    relTopicPath: `${categoryDir}/${topicDir}`
  };
}

export default function App() {
  const [copied, setCopied] = useState(false);

  // Organize full directory tree of all 31 topics
  const { categoryList, totalTopics, totalSolved } = useMemo(() => {
    const categoriesMap = {};
    let solvedCount = 0;

    // Index solution modules by relative topic path e.g. "01-describing-ui/01-first-component"
    const solutionMap = {};
    Object.keys(rawSolutionModules).forEach(solPath => {
      const cleanPath = solPath.replace(/^(\.\.\/|\.\/)/, '');
      const parts = cleanPath.split('/');
      if (parts.length >= 3) {
        const key = `${parts[0]}/${parts[1]}`;
        solutionMap[key] = {
          solPath,
          mod: rawSolutionModules[solPath]
        };
      }
    });

    // Parse all problem topics
    const problemPaths = Object.keys(allProblemFiles).sort();
    
    problemPaths.forEach(probPath => {
      const parsed = parseTopicPath(probPath);
      if (!parsed) return;

      const { categoryDir, categoryName, topicDir, topicName, relTopicPath } = parsed;
      const solutionMatch = solutionMap[relTopicPath];
      const isSolved = !!solutionMatch;

      if (isSolved) solvedCount++;

      const exports = [];
      let notes = null;

      if (isSolved) {
        const mod = solutionMatch.mod;
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
        notes = mod.answers || mod.notes || mod.metadata || null;
      }

      if (!categoriesMap[categoryDir]) {
        categoriesMap[categoryDir] = {
          name: categoryName,
          dir: categoryDir,
          topics: []
        };
      }

      categoriesMap[categoryDir].topics.push({
        dir: topicDir,
        name: topicName,
        relTopicPath,
        solutionPath: isSolved ? solutionMatch.solPath : `${relTopicPath}/Solution.jsx`,
        isSolved,
        exports,
        notes
      });
    });

    const categoryList = Object.values(categoriesMap);
    return {
      categoryList,
      totalTopics: problemPaths.length,
      totalSolved: solvedCount
    };
  }, []);

  // Active selection states
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedExport, setSelectedExport] = useState(null);

  // Default selection on load
  useEffect(() => {
    if (categoryList.length > 0) {
      const firstCat = categoryList[0];
      setSelectedCategory(firstCat.dir);
      if (firstCat.topics.length > 0) {
        const firstTopic = firstCat.topics[0];
        setSelectedTopic(firstTopic.relTopicPath);
        if (firstTopic.exports.length > 0) {
          setSelectedExport(firstTopic.exports[0].name);
        }
      }
    }
  }, [categoryList]);

  const activeCategoryObj = useMemo(() => {
    return categoryList.find(c => c.dir === selectedCategory);
  }, [categoryList, selectedCategory]);

  const activeTopicObj = useMemo(() => {
    if (!activeCategoryObj) return null;
    return activeCategoryObj.topics.find(t => t.relTopicPath === selectedTopic);
  }, [activeCategoryObj, selectedTopic]);

  const activeExportObj = useMemo(() => {
    if (!activeTopicObj || !activeTopicObj.isSolved) return null;
    return activeTopicObj.exports.find(e => e.name === selectedExport) || activeTopicObj.exports[0];
  }, [activeTopicObj, selectedExport]);

  const handleCopyTemplate = (relPath) => {
    const template = `import React from 'react';

/**
 * Solution for ${relPath}
 */

// Exercise 5.1: Named Export
export function Exercise5_1() {
  return (
    <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px' }}>
      <h3>Exercise 5.1 Solution</h3>
    </div>
  );
}

// Main Challenge: Default Export
export default function MainSolution() {
  return (
    <div style={{ padding: '20px', background: '#e0e7ff', borderRadius: '8px' }}>
      <h2>Main Challenge Solution</h2>
    </div>
  );
}
`;
    navigator.clipboard.writeText(template);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const progressPercent = Math.round((totalSolved / (totalTopics || 1)) * 100);

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
            <p className="subtitle">Interactive Solution Runner & Progress Tracker</p>
          </div>
        </div>

        <div className="header-meta">
          <div className="progress-bar-container">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <div className="stat-chip">
            <Box size={14} />
            <span>{totalSolved} / {totalTopics} Topics Solved ({progressPercent}%)</span>
          </div>
        </div>
      </header>

      <div className="workbench-body">
        {/* Sidebar */}
        <aside className="workbench-sidebar">
          <div className="sidebar-section-title">
            <BookOpen size={14} />
            <span>ALL TOPICS ({totalTopics})</span>
          </div>

          <nav className="nav-categories">
            {categoryList.map(cat => {
              const catSolvedCount = cat.topics.filter(t => t.isSolved).length;
              return (
                <div key={cat.dir} className="category-group">
                  <button
                    className={`category-btn ${selectedCategory === cat.dir ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCategory(cat.dir);
                      if (cat.topics.length > 0) {
                        const nextTopic = cat.topics[0];
                        setSelectedTopic(nextTopic.relTopicPath);
                        if (nextTopic.exports.length > 0) {
                          setSelectedExport(nextTopic.exports[0].name);
                        } else {
                          setSelectedExport(null);
                        }
                      }
                    }}
                  >
                    <Folder size={16} />
                    <span className="cat-name">{cat.name}</span>
                    <span className={`cat-badge ${catSolvedCount > 0 ? 'badge-solved' : ''}`}>
                      {catSolvedCount}/{cat.topics.length}
                    </span>
                  </button>

                  {selectedCategory === cat.dir && (
                    <div className="topics-list">
                      {cat.topics.map(topic => (
                        <button
                          key={topic.relTopicPath}
                          className={`topic-btn ${selectedTopic === topic.relTopicPath ? 'active' : ''}`}
                          onClick={() => {
                            setSelectedTopic(topic.relTopicPath);
                            if (topic.exports.length > 0) {
                              setSelectedExport(topic.exports[0].name);
                            } else {
                              setSelectedExport(null);
                            }
                          }}
                        >
                          {topic.isSolved ? (
                            <CheckCircle2 size={14} className="icon-solved" />
                          ) : (
                            <Circle size={14} className="icon-unsolved" />
                          )}
                          <span className="topic-text">{topic.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
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
                  {activeTopicObj.isSolved ? (
                    <span className="status-tag status-solved"><CheckCircle2 size={12} /> Solved</span>
                  ) : (
                    <span className="status-tag status-unsolved"><Circle size={12} /> Unsolved</span>
                  )}
                </div>
                <div className="file-path-tag">
                  <code>./{activeTopicObj.solutionPath}</code>
                </div>
              </div>

              {activeTopicObj.isSolved ? (
                <>
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
                </>
              ) : (
                /* Unsolved Topic Starter Screen */
                <div className="unsolved-card">
                  <div className="unsolved-header">
                    <PlusCircle size={32} className="text-accent" />
                    <h2>Start Practicing: {activeTopicObj.name}</h2>
                    <p>No <code>Solution.jsx</code> file found in <code>./{activeTopicObj.relTopicPath}/</code> yet.</p>
                  </div>

                  <div className="unsolved-actions">
                    <button
                      className="btn-copy-template"
                      onClick={() => handleCopyTemplate(activeTopicObj.relTopicPath)}
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      <span>{copied ? 'Template Copied to Clipboard!' : 'Copy Starter Solution.jsx Template'}</span>
                    </button>
                  </div>

                  <div className="unsolved-instructions">
                    <h4>Steps to solve:</h4>
                    <ol>
                      <li>Create a new file named <strong><code>Solution.jsx</code></strong> inside <code>./{activeTopicObj.relTopicPath}/</code></li>
                      <li>Paste the starter template or write your React component solutions.</li>
                      <li>Save the file — this workbench will automatically detect it and render your live code!</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state">
              <Sparkles size={48} />
              <h2>Welcome to React Practice Workbench</h2>
              <p>Select any topic from the sidebar to start practicing!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
