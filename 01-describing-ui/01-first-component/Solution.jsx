import React from 'react';

/**
 * -------------------------------------------------------------------
 * Written / Conceptual Answers (Sections 1, 2, 3, 4, 7)
 * -------------------------------------------------------------------
 */
export const answers = {
  recall: {
    q1: "A React component is a JavaScript function that returns JSX markup. Rule 1: Name must start with a capital letter. Rule 2: Must return valid JSX.",
    q2: "Capitalized names tell React it is a custom component (<NavBar/> -> React component). Lowercase tags (<navBar/>) are interpreted as standard HTML elements, which browser does not recognize.",
    q3: "ASI (Automatic Semicolon Insertion) adds a semicolon after `return`, making it return `undefined`. Parentheses `return (...)` prevent ASI.",
    q4: "Default export allows `import AnyName from './file'`, named export requires `import { MyComponent } from './file'`.",
    q5: "The root component (e.g. <App/>) is top-level. Component composition lets smaller child components be nested anywhere reusable."
  },
  codeReading: {
    ex3_1: "Renders empty <badge></badge> HTML tags because lowercase tags are not recognized as React component calls.",
    ex3_2: "Returns `undefined` because of ASI on the line break after `return`.",
    ex3_3: "Renders: <section><h1>Understanding Components</h1><p>By: Jane Doe</p><article><p>React makes UI development modular.</p></article><p>By: Jane Doe</p></section>"
  }
};

/**
 * -------------------------------------------------------------------
 * Exercise 5.1: The Atomic Component
 * -------------------------------------------------------------------
 */
export function CallToAction() {
  return (
    <section style={{ padding: '24px', background: '#e0e7ff', borderRadius: '12px', textAlign: 'center' }}>
      <h2 style={{ color: '#3730a3', marginBottom: '12px' }}>Ready to get started?</h2>
      <button style={{ padding: '10px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
        Join Now
      </button>
    </section>
  );
}

/**
 * -------------------------------------------------------------------
 * Exercise 5.2: Composing a Page Layout
 * -------------------------------------------------------------------
 */
function Header() {
  return (
    <header style={{ padding: '16px', background: '#1e293b', color: '#fff', borderRadius: '8px 8px 0 0' }}>
      <h1 style={{ fontSize: '1.25rem' }}>DevPlatform App</h1>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{ padding: '12px', background: '#0f172a', color: '#94a3b8', textAlign: 'center', fontSize: '0.85rem', borderRadius: '0 0 8px 8px' }}>
      <p>&copy; 2026 DevPlatform Inc. All rights reserved.</p>
    </footer>
  );
}

export function LandingPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
      <Header />
      <main style={{ padding: '24px', background: '#f8fafc' }}>
        <h2>Welcome to the Platform</h2>
        <p>Build modular user interfaces effortlessly with React components.</p>
      </main>
      <Footer />
    </div>
  );
}

/**
 * -------------------------------------------------------------------
 * Exercise 6.1: Extracting Reusable UI (FeatureCard)
 * -------------------------------------------------------------------
 */
function FeatureCard() {
  return (
    <div style={{ padding: '16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <h3 style={{ color: '#0f172a', fontSize: '1rem', marginBottom: '6px' }}>Feature Highlight</h3>
      <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Optimized performance and modular architectural design.</p>
    </div>
  );
}

export function FeatureGrid() {
  return (
    <section style={{ padding: '20px', background: '#f1f5f9', borderRadius: '10px' }}>
      <h2 style={{ marginBottom: '16px', color: '#1e293b' }}>Why Choose Us</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        <FeatureCard />
        <FeatureCard />
        <FeatureCard />
      </div>
    </section>
  );
}

/**
 * -------------------------------------------------------------------
 * Exercise 6.2: Flattening Deeply Nested Code
 * -------------------------------------------------------------------
 */
function OrderHeader() {
  return <h2 style={{ color: '#0f172a', fontSize: '1.1rem' }}>Your Order Details</h2>;
}

function OrderItem() {
  return <li style={{ padding: '4px 0', color: '#334155' }}>Mechanical Keyboard - $120</li>;
}

function OrderItemList() {
  return (
    <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginTop: '8px' }}>
      <OrderItem />
      <OrderItem />
    </ul>
  );
}

export function OrderSummary() {
  return (
    <div style={{ padding: '20px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
      <OrderHeader />
      <OrderItemList />
    </div>
  );
}

/**
 * -------------------------------------------------------------------
 * Exercise 8: Real-World Challenge (SaaSLandingPage - Default Export)
 * -------------------------------------------------------------------
 */
function NavigationBar() {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: '#0f172a', color: '#fff' }}>
      <strong style={{ fontSize: '1.2rem', color: '#818cf8' }}>SaaSFlow</strong>
      <div style={{ display: 'flex', gap: '16px', fontSize: '0.9rem' }}>
        <span>Features</span>
        <span>Pricing</span>
        <span>Contact</span>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section style={{ padding: '40px 24px', textAlign: 'center', background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', color: '#fff' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '12px' }}>Engineered for Scalable Productivity</h1>
      <p style={{ color: '#c7d2fe', marginBottom: '20px', maxWidth: '600px', margin: '0 auto 20px' }}>
        The all-in-one platform designed to accelerate developer workflows with modular components.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
        <button style={{ padding: '10px 20px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>
          Get Started
        </button>
        <button style={{ padding: '10px 20px', background: 'transparent', color: '#fff', border: '1px solid #818cf8', borderRadius: '6px' }}>
          Live Demo
        </button>
      </div>
    </section>
  );
}

function CompanyLogo() {
  return (
    <div style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}>
      COMPANY_LOGO
    </div>
  );
}

function SocialProof() {
  return (
    <section style={{ padding: '24px', background: '#1e293b', color: '#94a3b8', textAlign: 'center' }}>
      <p style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
        Trusted by industry leaders
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', color: '#cbd5e1' }}>
        <CompanyLogo />
        <CompanyLogo />
        <CompanyLogo />
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer style={{ padding: '16px 24px', background: '#0f172a', color: '#64748b', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
      <span>&copy; 2026 SaaSFlow Inc.</span>
      <a href="#terms" style={{ color: '#818cf8', textDecoration: 'none' }}>Terms of Service</a>
    </footer>
  );
}

export default function SaaSLandingPage() {
  return (
    <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #334155' }}>
      <NavigationBar />
      <HeroSection />
      <SocialProof />
      <FooterSection />
    </div>
  );
}
