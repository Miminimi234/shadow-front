import React, { useEffect, useState } from 'react';

interface LandingProps {
  onLaunch: () => void;
}

export default function Landing({ onLaunch }: LandingProps) {
  return (
    <div className="landing">
      <Hero onLaunch={onLaunch} />
      <Problem />
      <Solution />
      <Features />
      <HowItWorks />
      <Privacy />
      <UseCases />
      <TechSpecs />
      <Comparison />
      <CTA onLaunch={onLaunch} />
      <Footer />
    </div>
  );
}

function Hero({ onLaunch }: { onLaunch: () => void }) {
  return (
    <section className="hero">
      <PoHBackground />
      
      <div className="hero-content">
        <div className="hero-logo">
          <span className="logo-icon">▪</span>
          <h1>SHADOWCHAIN</h1>
        </div>

        <p className="hero-tagline">
          Privacy-Native Blockchain for the Shadows
        </p>

        <p className="hero-subtitle">
          Solana's Speed + Advanced Privacy = True Anonymity
        </p>

        <div className="hero-actions">
          <button className="btn-primary" onClick={onLaunch}>
            Launch App
          </button>
          <button className="btn-secondary" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
            Read Docs
          </button>
          <button className="btn-secondary" onClick={onLaunch}>
            View Demo
          </button>
        </div>

        <div className="hero-stats">
          <div className="stat-chip">▸ 400ms Blocks</div>
          <div className="stat-chip">◈ zk-SNARKs</div>
          <div className="stat-chip">▸ 50K+ TPS</div>
        </div>
      </div>

      <div className="scroll-indicator">
        <div className="scroll-arrow">↓</div>
      </div>
    </section>
  );
}

function PoHBackground() {
  const [hashes, setHashes] = useState<string[]>([]);

  useEffect(() => {
    const generateHash = () => {
      return Array.from({ length: 16 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
    };

    const interval = setInterval(() => {
      setHashes(prev => [generateHash(), ...prev.slice(0, 20)]);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="poh-background">
      {hashes.map((hash, i) => (
        <div
          key={i}
          className="hash-line"
          style={{ opacity: 1 - (i * 0.05) }}
        >
          {hash}
        </div>
      ))}
    </div>
  );
}

function Problem() {
  const problems = [
    { icon: '✗', title: 'Your balance is visible to everyone', desc: 'Anyone can see exactly how much you own' },
    { icon: '✗', title: 'Every transaction you make is tracked', desc: 'All your payments are permanently public' },
    { icon: '✗', title: 'Your spending patterns are analyzed', desc: 'Companies build profiles from your on-chain activity' },
    { icon: '✗', title: 'Your connections are mapped', desc: 'Every wallet you interact with is recorded forever' },
  ];

  return (
    <section className="section problem-section">
      <div className="section-content">
        <h2 className="section-title">THE BLOCKCHAIN TRANSPARENCY PROBLEM</h2>
        
        <div className="problem-grid">
          {problems.map((problem, i) => (
            <div key={i} className="problem-card">
              <div className="problem-icon">{problem.icon}</div>
              <h3>{problem.title}</h3>
              <p>{problem.desc}</p>
            </div>
          ))}
        </div>

        <div className="problem-statement">
          <p>
            Every transaction on Solana, Ethereum, and most blockchains is 
            <strong> COMPLETELY PUBLIC</strong>. This isn't just inconvenient — 
            <strong> it's dangerous</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}

function Solution() {
  return (
    <section className="section solution-section">
      <div className="section-content">
        <h2 className="section-title">SHADOWCHAIN: PRIVACY BY DEFAULT</h2>
        
        <div className="solution-content">
          <div className="solution-text">
            <p className="large-text">
              We took Solana's blazing-fast architecture and integrated 
              battle-tested privacy technology.
            </p>
            
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span className="feature-text">FAST: 400ms blocks, 50,000+ TPS</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span className="feature-text">PRIVATE: zk-SNARKs hide all transaction details</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span className="feature-text">SECURE: Proven cryptography</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span className="feature-text">FLEXIBLE: Choose transparent or shielded</span>
              </div>
            </div>

            <blockquote>
              "The first blockchain with both speed AND privacy"
            </blockquote>
          </div>

          <div className="solution-visual">
            <div className="shield-animation">
              <div className="shield">◆</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: '▸',
      title: 'FAST',
      subtitle: '400ms blocks',
      details: ['50K+ TPS', 'PoH + Tower BFT', 'Sub-second finality'],
    },
    {
      icon: '◈',
      title: 'PRIVATE',
      subtitle: 'zk-SNARKs',
      details: ['Hidden amounts', 'Hidden addresses', 'Shielded pool'],
    },
    {
      icon: '◆',
      title: 'SECURE',
      subtitle: 'Sapling Circuit',
      details: ['Groth16 proofs', 'Battle-tested', '128-bit security'],
    },
    {
      icon: '≡',
      title: 'BRIDGE',
      subtitle: 'Obfuscation',
      details: ['Break links', 'Mix transactions', 'Complete privacy'],
    },
    {
      icon: '◇',
      title: 'FLEXIBLE',
      subtitle: 'Your choice',
      details: ['Transparent', 'Shielded', 'Per transaction'],
    },
    {
      icon: '⊙',
      title: 'AUDITABLE',
      subtitle: 'Viewing keys',
      details: ['Optional transparency', 'Regulatory compliance', 'Selective disclosure'],
    },
    {
      icon: '▸',
      title: 'SCALABLE',
      subtitle: 'Parallel processing',
      details: ['Sealevel VM', 'Horizontal scaling', 'High throughput'],
    },
    {
      icon: '◎',
      title: 'SIMPLE',
      subtitle: 'Easy to use',
      details: ['MetaMask support', 'Phantom wallet', 'Familiar UX'],
    },
  ];

  return (
    <section className="section features-section">
      <div className="section-content">
        <h2 className="section-title">CORE FEATURES</h2>
        
        <div className="features-grid">
          {features.map((feature, i) => (
            <div key={i} className="feature-card">
              <div className="feature-card-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p className="feature-subtitle">{feature.subtitle}</p>
              <ul>
                {feature.details.map((detail, j) => (
                  <li key={j}>{detail}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="section how-it-works-section">
      <div className="section-content">
        <h2 className="section-title">HOW IT WORKS</h2>

        <div className="architecture-grid">
          <div className="architecture-layer">
            <h3>▸ Consensus Layer (Solana)</h3>
            
            <div className="tech-box">
              <h4>Proof of History</h4>
              <div className="tech-description">
                <p>Verifiable time via hash chain</p>
                <code>SHA256(SHA256(...))</code>
                <p>Proves order without consensus</p>
              </div>
              <div className="hash-chain">
                <div className="hash-node">Hash1 →</div>
                <div className="hash-node">Hash2 →</div>
                <div className="hash-node">Hash3 →</div>
                <div className="hash-node">...</div>
              </div>
            </div>

            <div className="tech-box">
              <h4>Tower BFT</h4>
              <div className="tech-description">
                <p>Stake-weighted voting</p>
                <p>66.67% for finality</p>
                <p>~1 second finality</p>
              </div>
              <div className="validator-votes">
                <div className="vote">Val1: 15% ✓</div>
                <div className="vote">Val2: 20% ✓</div>
                <div className="vote active">Val3: 35% ✓ ← 70% = Finalized!</div>
              </div>
            </div>
          </div>

          <div className="architecture-layer">
            <h3>◈ Privacy Layer</h3>
            
            <div className="tech-box">
              <h4>Shielded Pool</h4>
              <div className="tech-description">
                <p>Note commitment tree (Merkle)</p>
                <p>Hidden amounts & addresses</p>
                <p>Nullifier prevents double-spend</p>
                <p>zk-SNARK proves validity</p>
              </div>
              <div className="merkle-tree">
                <div className="tree-node root">Root</div>
                <div className="tree-level">
                  <div className="tree-node">N1</div>
                  <div className="tree-node">N2</div>
                </div>
                <div className="tree-level">
                  <div className="tree-node">C1</div>
                  <div className="tree-node">C2</div>
                  <div className="tree-node">C3</div>
                  <div className="tree-node">C4</div>
                </div>
              </div>
            </div>

            <div className="flow-diagram">
              <h4>Transaction Flow:</h4>
              <div className="flow-steps">
                <div className="flow-step">1. Own note</div>
                <div className="flow-arrow">→</div>
                <div className="flow-step">2. Generate proof</div>
                <div className="flow-arrow">→</div>
                <div className="flow-step">3. Reveal nullifier</div>
                <div className="flow-arrow">→</div>
                <div className="flow-step">4. Create commitments</div>
                <div className="flow-arrow">→</div>
                <div className="flow-step">5. Verify</div>
              </div>
            </div>
          </div>
        </div>

        <div className="privacy-guarantee">
          <h3>What We Hide:</h3>
          <div className="hidden-items">
            <div className="hidden-item">✗ Sender address</div>
            <div className="hidden-item">✗ Recipient address</div>
            <div className="hidden-item">✗ Transaction amount</div>
          </div>
          <p className="privacy-note">
            Nobody can see: <strong>WHO</strong>, <strong>HOW MUCH</strong>, or <strong>TO WHOM</strong>
          </p>
        </div>
      </div>
    </section>
  );
}

function Privacy() {
  return (
    <section className="section privacy-section">
      <div className="section-content">
        <h2 className="section-title">PRIVACY GUARANTEES</h2>

        <div className="guarantees-grid">
          <div className="guarantee-box">
            <h3>WHAT WE HIDE</h3>
            <div className="hide-list">
              <div className="hide-item">✓ Sender address</div>
              <div className="hide-item">✓ Recipient address</div>
              <div className="hide-item">✓ Transaction amount</div>
              <div className="hide-item">✓ Your balance</div>
              <div className="hide-item">✓ Transaction graph connections</div>
            </div>
          </div>

          <div className="guarantee-box">
            <h3>WHAT'S VISIBLE</h3>
            <div className="visible-list">
              <div className="visible-item">• A transaction occurred (timestamp)</div>
              <div className="visible-item">• zk-SNARK proof (proves validity)</div>
              <div className="visible-item">• Nullifier (prevents double-spend)</div>
              <div className="visible-item">• New commitment (encrypted note)</div>
            </div>
          </div>
        </div>

        <div className="crypto-guarantees">
          <h3>CRYPTOGRAPHIC GUARANTEES</h3>
          <div className="crypto-grid">
            <div className="crypto-item">
              <div className="crypto-icon">◈</div>
              <h4>zk-SNARKs</h4>
              <p>Groth16 on BN254</p>
              <p>128-bit security</p>
            </div>
            <div className="crypto-item">
              <div className="crypto-icon">◈</div>
              <h4>Pedersen</h4>
              <p>Unconditionally hiding</p>
              <p>Computationally binding</p>
            </div>
            <div className="crypto-item">
              <div className="crypto-icon">◈</div>
              <h4>SHA256</h4>
              <p>Collision resistant</p>
              <p>Pre-image resistant</p>
            </div>
          </div>
          <p className="crypto-note">
            Privacy you can <strong>verify</strong>, not just trust
          </p>
        </div>
      </div>
    </section>
  );
}

function UseCases() {
  const cases = [
    {
      icon: '⚙',
      title: 'AI AGENTS',
      description: 'Autonomous agents need privacy to prevent front-running and strategy copying. ShadowChain lets agents trade without revealing their tactics.',
    },
    {
      icon: '▣',
      title: 'BUSINESSES',
      description: 'Companies can\'t have competitors seeing every payment. ShadowChain enables B2B payments with corporate privacy.',
    },
    {
      icon: '●',
      title: 'INDIVIDUALS',
      description: 'Your salary, rent, and purchases shouldn\'t be public information. ShadowChain gives you financial privacy by default.',
    },
    {
      icon: '◫',
      title: 'GAMING',
      description: 'In-game economies need privacy for strategy. No one should see your gold stash or trading patterns.',
    },
    {
      icon: '⇄',
      title: 'DEFI',
      description: 'Private trading means no front-running, no MEV, no sandwich attacks. Trade like a dark pool.',
    },
  ];

  return (
    <section className="section use-cases-section">
      <div className="section-content">
        <h2 className="section-title">WHO NEEDS SHADOWCHAIN?</h2>
        
        <div className="use-cases-grid">
          {cases.map((useCase, i) => (
            <div key={i} className="use-case-card">
              <div className="use-case-icon">{useCase.icon}</div>
              <h3>{useCase.title}</h3>
              <p>{useCase.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechSpecs() {
  return (
    <section className="section tech-specs-section">
      <div className="section-content">
        <h2 className="section-title">TECHNICAL SPECIFICATIONS</h2>

        <div className="specs-grid">
          <div className="spec-category">
            <h3>CONSENSUS</h3>
            <div className="spec-item">
              <span className="spec-label">Mechanism:</span>
              <span className="spec-value">Proof of History + Tower BFT</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Block time:</span>
              <span className="spec-value">400ms (average)</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Finality:</span>
              <span className="spec-value">~1.3 seconds</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Validators:</span>
              <span className="spec-value">21-1000</span>
            </div>
          </div>

          <div className="spec-category">
            <h3>PERFORMANCE</h3>
            <div className="spec-item">
              <span className="spec-label">Throughput:</span>
              <span className="spec-value">50,000+ TPS</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Shielded TPS:</span>
              <span className="spec-value">1,000+ TPS</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Mixed TPS:</span>
              <span className="spec-value">10,000+ TPS</span>
            </div>
          </div>

          <div className="spec-category">
            <h3>PRIVACY</h3>
            <div className="spec-item">
              <span className="spec-label">zk-SNARK:</span>
              <span className="spec-value">Groth16</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Curve:</span>
              <span className="spec-value">BN254</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Proof size:</span>
              <span className="spec-value">~200 bytes</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Generation:</span>
              <span className="spec-value">3-7 seconds</span>
            </div>
          </div>

          <div className="spec-category">
            <h3>TOKEN</h3>
            <div className="spec-item">
              <span className="spec-label">Symbol:</span>
              <span className="spec-value">$SHOL</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Supply:</span>
              <span className="spec-value">500M SHOL</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Model:</span>
              <span className="spec-value">Deflationary</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Comparison() {
  const data = [
    { feature: 'TPS', solana: '65,000', zcash: '27', monero: '~1,700', shadowchain: '50,000+' },
    { feature: 'Block Time', solana: '400ms', zcash: '75s', monero: '120s', shadowchain: '400ms' },
    { feature: 'Finality', solana: '~13s', zcash: '~10min', monero: '~20min', shadowchain: '~1.3s' },
    { feature: 'Privacy', solana: 'None', zcash: 'Optional', monero: 'Default', shadowchain: 'Optional' },
    { feature: 'zk-SNARKs', solana: 'No', zcash: 'Yes', monero: 'No', shadowchain: 'Yes' },
    { feature: 'Smart Contracts', solana: 'Yes', zcash: 'Limited', monero: 'No', shadowchain: 'Yes' },
    { feature: 'Bridge', solana: 'No', zcash: 'No', monero: 'No', shadowchain: 'Built-in' },
  ];

  return (
    <section className="section comparison-section">
      <div className="section-content">
        <h2 className="section-title">COMPARISON</h2>

        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Solana</th>
                <th>Zcash</th>
                <th>Monero</th>
                <th className="highlight">ShadowChain</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  <td className="feature-name">{row.feature}</td>
                  <td>{row.solana}</td>
                  <td>{row.zcash}</td>
                  <td>{row.monero}</td>
                  <td className="highlight">{row.shadowchain}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="comparison-conclusion">
          <strong>Winner: ShadowChain</strong> combines the best of all worlds
        </p>
      </div>
    </section>
  );
}

function CTA({ onLaunch }: { onLaunch: () => void }) {
  return (
    <section className="section cta-section">
      <div className="cta-content">
        <h2>READY TO ENTER THE SHADOWS?</h2>
        
        <div className="cta-buttons">
          <button className="btn-primary large" onClick={onLaunch}>
            LAUNCH APP
          </button>
          <button className="btn-secondary large">
            READ DOCS
          </button>
          <button className="btn-secondary large">
            JOIN DISCORD
          </button>
        </div>

        <div className="social-links">
          <button type="button" className="link-button">
            ★ Star on GitHub
          </button>
          <span>•</span>
          <button type="button" className="link-button">
            ◦ Follow on Twitter
          </button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <span>▪</span>
          <span>SHADOWCHAIN</span>
        </div>
        
        <div className="footer-links">
          <button type="button" className="link-button">
            Documentation
          </button>
          <button type="button" className="link-button">
            GitHub
          </button>
          <button type="button" className="link-button">
            Discord
          </button>
          <button type="button" className="link-button">
            Twitter
          </button>
        </div>

        <div className="footer-bottom">
          <p>© 2024 ShadowChain. Privacy-native blockchain.</p>
          <p>Testnet v1.0.0</p>
        </div>
      </div>
    </footer>
  );
}
