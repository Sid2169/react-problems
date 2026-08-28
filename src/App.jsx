import React, { useState, useEffect, useMemo } from 'react';
import {
  Check,
  Copy,
  Terminal,
  Code2,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Circle,
  FileCode,
  Layers,
  AlertTriangle,
  Play
} from 'lucide-react';

import { generateSolutionFromMd } from './utils/scaffolder.js';

// Error Boundary for user solution components
class ComponentErrorBoundary extends React.Component {
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
            <h3>Runtime Error in Solution Component</h3>
          </div>
          <pre className="error-stack">{this.state.error?.toString()}</pre>
          <p className="error-tip">
            Fix the syntax or logic error in your <code>Solution.jsx</code> file and save to re-render.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Auto-discover all problems.md and Solution.jsx files across all 31 topics
const problemFiles = import.meta.glob('/0*/*-*/problems.md', { query: '?raw', import: 'default', eager: true });
const solutionFiles = import.meta.glob('/0*/*-*/Solution.jsx', { eager: true });
const lowercaseSolutionFiles = import.meta.glob('/0*/*-*/solution.jsx', { eager: true });

// Robust clipboard copy with fallback
const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    // Fallback using textarea element
  }
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return successful;
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
};

export default function App() {
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);

  // Index all categories and topics
  const { categoryList, totalTopics, totalSolved } = useMemo(() => {
    const categoriesMap = {};
    const problemPaths = Object.keys(problemFiles);
    let solvedCount = 0;

    problemPaths.forEach((probPath) => {
      const parts = probPath.split('/');
      const categoryDir = parts[1];
      const topicDir = parts[2];
      const relTopicPath = `${categoryDir}/${topicDir}`;

      const formatTitle = (str) =>
        str
          .replace(/^\d+-/, '')
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');

      const categoryName = formatTitle(categoryDir);
      const topicName = formatTitle(topicDir);

      const solKey = `/${relTopicPath}/Solution.jsx`;
      const lowerSolKey = `/${relTopicPath}/solution.jsx`;
      const solutionMatch = solutionFiles[solKey]
        ? { mod: solutionFiles[solKey], solPath: solKey }
        : lowercaseSolutionFiles[lowerSolKey]
        ? { mod: lowercaseSolutionFiles[lowerSolKey], solPath: lowerSolKey }
        : null;

      const isSolved = !!solutionMatch;
      if (isSolved) solvedCount++;

      const exports = [];
      let notes = null;

      if (isSolved && solutionMatch.mod) {
        const mod = solutionMatch.mod;
        Object.keys(mod).forEach((exportName) => {
          const exportedItem = mod[exportName];
          if (typeof exportedItem === 'function') {
            exports.push({
              name: exportName === 'default' ? 'Main Challenge Solution (Default)' : exportName,
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
    return categoryList.find((c) => c.dir === selectedCategory);
  }, [categoryList, selectedCategory]);

  const activeTopicObj = useMemo(() => {
    if (!activeCategoryObj) return null;
    return activeCategoryObj.topics.find((t) => t.relTopicPath === selectedTopic);
  }, [activeCategoryObj, selectedTopic]);

  const activeExportObj = useMemo(() => {
    if (!activeTopicObj || !activeTopicObj.isSolved) return null;
    return activeTopicObj.exports.find((e) => e.name === selectedExport) || activeTopicObj.exports[0];
  }, [activeTopicObj, selectedExport]);

  const handleCopyTemplate = async (relPath, topicName) => {
    const probKey = `/${relPath}/problems.md`;
    const mdContent = problemFiles[probKey] || '';
    const template = generateSolutionFromMd(mdContent, relPath);
    const success = await copyToClipboard(template);
    if (success) {
      setCopiedTemplate(true);
      setTimeout(() => setCopiedTemplate(false), 2000);
    }
  };

  const handleCopyCliCommand = async (relPath) => {
    const cmd = `npm run new ${relPath}`;
    const success = await copyToClipboard(cmd);
    if (success) {
      setCopiedCli(true);
      setTimeout(() => setCopiedCli(false), 2000);
    }
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
            <h1>React Practice Workbench</h1>
            <p className="subtitle">Interactive Solution Runner & Progress Tracker</p>
          </div>
        </div>

        <div className="header-meta">
          <div className="progress-bar-container">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <div className="stat-chip">
            <Layers size={14} />
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
            {categoryList.map((cat) => {
              const catSolvedCount = cat.topics.filter((t) => t.isSolved).length;
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
                        }
                      }
                    }}
                  >
                    <span className="cat-name">{cat.name}</span>
                    <span className="cat-count">
                      {catSolvedCount}/{cat.topics.length}
                    </span>
                  </button>

                  {selectedCategory === cat.dir && (
                    <ul className="topic-list">
                      {cat.topics.map((t) => (
                        <li key={t.relTopicPath}>
                          <button
                            className={`topic-btn ${selectedTopic === t.relTopicPath ? 'active' : ''}`}
                            onClick={() => {
                              setSelectedTopic(t.relTopicPath);
                              if (t.exports.length > 0) {
                                setSelectedExport(t.exports[0].name);
                              }
                            }}
                          >
                            {t.isSolved ? (
                              <CheckCircle2 size={14} className="icon-solved" />
                            ) : (
                              <Circle size={14} className="icon-unsolved" />
                            )}
                            <span className="topic-name">{t.name}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Workspace */}
        <main className="workbench-main">
          {activeTopicObj ? (
            <div className="workspace-container">
              {/* Workspace Header */}
              <div className="workspace-header">
                <div>
                  <div className="topic-breadcrumb">
                    <span>{activeCategoryObj?.name}</span> / <span>{activeTopicObj.name}</span>
                  </div>
                  <h2 className="topic-title">{activeTopicObj.name}</h2>
                </div>

                <div className="status-badge-container">
                  {activeTopicObj.isSolved ? (
                    <span className="badge-solved">
                      <CheckCircle2 size={14} /> Solved
                    </span>
                  ) : (
                    <span className="badge-unsolved">
                      <Circle size={14} /> Unsolved
                    </span>
                  )}
                </div>
              </div>

              {activeTopicObj.isSolved ? (
                <>
                  {/* Export Switcher Toolbar */}
                  {activeTopicObj.exports.length > 0 && (
                    <div className="export-switcher">
                      <span className="switcher-label">
                        <FileCode size={14} /> Component Exports:
                      </span>
                      <div className="export-pills">
                        {activeTopicObj.exports.map((e) => (
                          <button
                            key={e.name}
                            className={`pill-btn ${
                              (selectedExport || activeTopicObj.exports[0].name) === e.name ? 'active' : ''
                            }`}
                            onClick={() => setSelectedExport(e.name)}
                          >
                            <Play size={12} />
                            <span>{e.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Render Canvas Container */}
                  <div className="render-stage">
                    <div className="stage-header">
                      <span className="stage-title">Live Component Canvas</span>
                      <span className="export-name-tag">
                        Active: <code>{activeExportObj?.name || 'Default'}</code>
                      </span>
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
                    <FileCode size={36} className="text-accent" />
                    <h2>Start Practicing: {activeTopicObj.name}</h2>
                    <p>
                      No <code>Solution.jsx</code> file found in <code>./{activeTopicObj.relTopicPath}/</code> yet.
                    </p>
                  </div>

                  <div className="unsolved-actions">
                    <button
                      className="btn-copy-template"
                      onClick={() => handleCopyTemplate(activeTopicObj.relTopicPath, activeTopicObj.name)}
                    >
                      {copiedTemplate ? <Check size={16} /> : <Copy size={16} />}
                      <span>{copiedTemplate ? 'Template Copied!' : 'Copy Starter Solution.jsx Template'}</span>
                    </button>

                    <button
                      className="btn-copy-cli"
                      onClick={() => handleCopyCliCommand(activeTopicObj.relTopicPath)}
                    >
                      {copiedCli ? <Check size={16} /> : <Terminal size={16} />}
                      <span>{copiedCli ? 'CLI Command Copied!' : `Copy CLI Command: npm run new ${activeTopicObj.relTopicPath}`}</span>
                    </button>
                  </div>

                  <div className="unsolved-instructions">
                    <h4>Two Quick Ways to Start:</h4>
                    <ol>
                      <li>
                        <strong>Option A (CLI Scaffolder)</strong>: Run <code>npm run new {activeTopicObj.relTopicPath}</code> in your terminal to automatically extract problem code into <code>Solution.jsx</code>.
                      </li>
                      <li>
                        <strong>Option B (Manual Copy)</strong>: Click <em>"Copy Starter Solution.jsx Template"</em> above, create a <code>Solution.jsx</code> file inside <code>./{activeTopicObj.relTopicPath}/</code>, and paste.
                      </li>
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
