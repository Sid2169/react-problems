import React, { useState, useEffect } from 'react';

/**
 * -------------------------------------------------------------------
 * Solution for 03-managing-state/03-sharing-state
 * -------------------------------------------------------------------
 */

// Written Answers (Recall, Conceptual, Code Reading, Edge Cases)
export const answers = {
  recall: {
    q1: "", q2: "", q3: "", q4: "", q5: ""
  },
  conceptual: {
    q1: "", q2: ""
  }
};

/**
 * Exercise Block 1: Panel, Accordion
 */
export function Panel({ title, isActive, onShow }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? <p>Panel content...</p> : <button onClick={onShow}>Show</button>}
    </section>
  );
}

export function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      <Panel title="About" isActive={activeIndex === 0} onShow={() => setActiveIndex(0)} />
      <Panel title="Photos" isActive={activeIndex === 1} onShow={() => setActiveIndex(1)} />
    </div>
  );
}

/**
 * Exercise Block 2: IndependentPanel
 */
// Buggy Code: Each panel manages its own state independently
export function IndependentPanel({ title, isActive, changeActive }) {
  return (
    <div>
      <h3>{title}</h3>
      <button onClick={changeActive}>Toggle</button>
      {isActive && <p>Content</p>}
    </div>
  );
}

/**
 * Exercise Block 3: TabButton, TabbedDashboard
 */
export function TabButton({ label, isActive, onClick }) {
  return (
    <button onClick={onClick} style={{ background: isActive ? '#6366f1' : '#e2e8f0', color: isActive ? '#fff' : '#000', padding: '8px 16px', margin: '4px' }}>
      {label}
    </button>
  );
}

export default function TabbedDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <>
      <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px' }}>
      <div>
        <TabButton label="Overview" isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
        <TabButton label="Analytics" isActive={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
      </div>
      <div style={{ marginTop: '16px' }}>
        {activeTab === 'overview' && <p>Overview Metrics Here</p>}
        {activeTab === 'analytics' && <p>Detailed Analytics Charts Here</p>}
      </div>
    </div>
    </>
  );
}

