import React, { useState, useEffect } from 'react';

/**
 * -------------------------------------------------------------------
 * Solution for 01-describing-ui/02-importing-exporting
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
 * Exercise Block 1: SuccessAlert, ErrorAlert, App
 */
// src/components/Alert.js
export function SuccessAlert(){
  return <div className="alert-success">Operation Successful!</div>;
}

export function ErrorAlert(){
  return <div className="alert-error">Something went wrong.</div>;
}

// src/App.js


export function App(){
  return (
    <main>
      <SuccessAlert />
      <ErrorAlert />
    </main>
  );
}

/**
 * Exercise Block 2: Heading, Subheading, ArticleBody, ArticleView
 */
// src/design/Typography.js
export function Heading({ text }){
  return <h1>{text}</h1>;
}

export function Subheading({ text }){
  return <h3>{text}</h3>;
}

export function ArticleBody({ content }){
  return <p className="body-text">{content}</p>;
}

// src/views/ArticleView.js


export function ArticleView(){
  return (
    <article>
      <Heading text="The Future of Modular UI" />
      <Subheading text="Why imports matter" />
      <Body content="React components thrive when isolated into focused files." />
    </article>
  );
}

/**
 * Exercise Block 3: StatCard, Dashboard
 */
// src/widgets/statCard.js
export function StatCard(){
  return <div className="card">99.9% Uptime</div>;
}

// src/Dashboard.js


export function Dashboard(){
  return (
    <section>
      <h2>System Status</h2>
      <statCard />
    </section>
  );
}

/**
 * Exercise Block 4: Avatar, UserDetails, App_v2
 */
// Buggy Starter Code: src/UserProfile.js
export function Avatar(){
  return <img src="/default-avatar.png" alt="User Avatar" />;
}

export function UserDetails(){
  return (
    <div>
      <h3>Alex Rivera</h3>
      <p>Senior Engineer</p>
    </div>
  );
}

// Buggy Starter Code: src/App.js


export function App_v2(){
  return (
    <section className="profile-card">
      <Avatar />
      <UserDetails />
    </section>
  );
}

/**
 * Exercise Block 5: SearchInput, Header
 */
// Buggy Starter Code: src/components/SearchInput.js
export const SearchInput = () => {
  return (
    <div className="search-box">
      <input type="text" placeholder="Search documentation..." />
    </div>
  );
};

// Buggy Starter Code: src/Header.js


export function Header(){
  return (
    <header>
      <h1>Knowledge Base</h1>
      <SearchInput />
    </header>
  );
}

/**
 * Exercise Block 6: StatDisplay, ConversionChart, ExportReportButton, AnalyticsDashboard
 */
// Legacy Monolithic Code: src/AnalyticsDashboard.js
export function StatDisplay(){
  return <div className="stat">Total Visitors: 14,209</div>;
}

export function ConversionChart(){
  return <div className="chart-placeholder">[Chart Visual Here]</div>;
}

export function ExportReportButton(){
  return <button className="btn-export">Download CSV</button>;
}

export function AnalyticsDashboard(){
  return (
    <div className="dashboard-container">
      <header>
        <h1>Performance Analytics</h1>
        <ExportReportButton />
      </header>
      <section className="metrics-grid">
        <StatDisplay />
        <StatDisplay />
        <ConversionChart />
      </section>
    </div>
  );
}

/**
 * Exercise Block 7: PrimaryNavigation, FooterLinks, PageLayout
 */
// Legacy Code: src/components/PrimaryNavigation.js
export function PrimaryNavigation(){
  return <nav><ul><li>Home</li><li>Pricing</li></ul></nav>;
}


// Legacy Code: src/components/FooterLinks.js
export function FooterLinks(){
  return <footer><p>© 2026 SaaS Inc.</p></footer>;
}


// Legacy Code: src/PageLayout.js



export default function PageLayout(){
  return (
    <div className="layout">
      <Nav />
      <main>Page Content</main>
      <Foot />
    </div>
  );
}

