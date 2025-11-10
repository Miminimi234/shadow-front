import { useEffect, useState } from 'react';
import headerLogo from './assets/shadowlogo.png';
import { apiPath } from './config';
import { useChainMetrics } from './hooks/useChainMetrics';
import { useWebSocket } from './hooks/useWebSocket';
import Bridge from './pages/Bridge';
import Consensus from './pages/Consensus';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Privacy from './pages/Privacy';
import Transactions from './pages/Transactions';
import Validators from './pages/Validators';
import Wallet from './pages/Wallet';
import './shadow-theme.css';

type Page = 'dashboard' | 'consensus' | 'privacy' | 'transactions' | 'wallet' | 'validators' | 'bridge';

const NODE_API_LINK = apiPath('/shadow/info');

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { metrics, loading } = useChainMetrics();
  const events = useWebSocket();

  // Check if user has visited before
  useEffect(() => {
    const hasVisited = localStorage.getItem('shadowchain_visited');
    if (hasVisited) {
      setShowLanding(false);
    }
  }, []);

  const handleLaunchApp = () => {
    localStorage.setItem('shadowchain_visited', 'true');
    setShowLanding(false);
  };

  const handleReturnToLanding = () => {
    setShowLanding(true);
    setMobileMenuOpen(false);
  };

  // Show landing page
  if (showLanding) {
    return <Landing onLaunch={handleLaunchApp} />;
  }

  const formatNumber = (num: number | undefined) => {
    if (!num) return '0';
    return num.toLocaleString();
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard metrics={metrics} events={events} />;
      case 'consensus':
        return <Consensus metrics={metrics} />;
      case 'privacy':
        return <Privacy metrics={metrics} />;
      case 'transactions':
        return <Transactions />;
      case 'wallet':
        return <Wallet />;
      case 'validators':
        return <Validators />;
      case 'bridge':
        return <Bridge />;
      default:
        return <Dashboard metrics={metrics} events={events} />;
    }
  };

  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <button
            type="button"
            className="header-brand"
            onClick={handleReturnToLanding}
            aria-label="Return to landing page"
          >
            <div className="logo-container">
              <img src={headerLogo} alt="ShadowChain" className="header-logo" />
            </div>
            <div className="brand-info">
              <h1>SHADOWCHAIN</h1>
              <p>Privacy-Native High-Performance Blockchain</p>
            </div>
          </button>
        </div>

        <div className="header-center">
          <div className="network-badge">
            <span className="status-dot"></span>
            TESTNET
          </div>
          <button
            className="mobile-menu-button"
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
            aria-controls="app-sidebar"
            onClick={() => setMobileMenuOpen(open => !open)}
          >
            {mobileMenuOpen ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6l12 12M6 18L18 6" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>

        <div className="header-right">
          <div className="header-stat">
            <span className="stat-label">SLOT</span>
            <span className="stat-value">{formatNumber(metrics?.slot)}</span>
          </div>
          <div className="header-stat">
            <span className="stat-label">TPS</span>
            <span className="stat-value">{formatNumber(Math.floor(metrics?.tps || 0))}</span>
          </div>
          <div className="header-stat">
            <span className="stat-label">EPOCH</span>
            <span className="stat-value">{metrics?.epoch || 0}</span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="main-layout">
        {/* Sidebar */}
        <aside id="app-sidebar" className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleNavigation('dashboard')}
            >
              <span className="nav-icon">DASH</span>
              <span>Dashboard</span>
            </button>
            <button
              className={`nav-item ${currentPage === 'consensus' ? 'active' : ''}`}
              onClick={() => handleNavigation('consensus')}
            >
              <span className="nav-icon">POH</span>
              <span>Consensus</span>
            </button>
            <button
              className={`nav-item ${currentPage === 'privacy' ? 'active' : ''}`}
              onClick={() => handleNavigation('privacy')}
            >
              <span className="nav-icon">PRIV</span>
              <span>Privacy Pool</span>
            </button>
            <button
              className={`nav-item ${currentPage === 'transactions' ? 'active' : ''}`}
              onClick={() => handleNavigation('transactions')}
            >
              <span className="nav-icon">TX</span>
              <span>Transactions</span>
            </button>
            <button
              className={`nav-item ${currentPage === 'wallet' ? 'active' : ''}`}
              onClick={() => handleNavigation('wallet')}
            >
              <span className="nav-icon">WALL</span>
              <span>Wallet</span>
            </button>
            <button
              className={`nav-item ${currentPage === 'validators' ? 'active' : ''}`}
              onClick={() => handleNavigation('validators')}
            >
              <span className="nav-icon">VAL</span>
              <span>Validators</span>
            </button>
            <button
              className={`nav-item ${currentPage === 'bridge' ? 'active' : ''}`}
              onClick={() => handleNavigation('bridge')}
            >
              <span className="nav-icon">BRDG</span>
              <span>Bridge</span>
            </button>
          </nav>

          {/* Quick Stats */}
          <div className="sidebar-stats">
            <div className="quick-stat">
              <div className="quick-stat-label">Shielded Ratio</div>
              <div className="quick-stat-value">
                {metrics ? ((metrics.shielded_txs / Math.max(1, metrics.total_transactions)) * 100).toFixed(1) : '0'}%
              </div>
            </div>
            <div className="quick-stat">
              <div className="quick-stat-label">Pool Size</div>
              <div className="quick-stat-value">{formatNumber(metrics?.shielded_pool_size)}</div>
            </div>
            <div className="quick-stat">
              <div className="quick-stat-label">Validators</div>
              <div className="quick-stat-value">{metrics?.active_validators || 0}</div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {loading ? (
            <div className="loading-screen">
              <div className="spinner-large"></div>
              <p>Loading ShadowChain...</p>
            </div>
          ) : (
            renderPage()
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-left">
          <span>SHADOWCHAIN v1.0.0</span>
          <span className="separator">|</span>
          <span>Solana PoH + Sapling Privacy</span>
        </div>
        <div className="footer-right">
          <button
            onClick={() => setCurrentPage('wallet')}
            style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', textDecoration: 'none' }}
          >
            Faucet
          </button>
          <span className="separator">|</span>
          <a href={NODE_API_LINK} target="_blank" rel="noopener noreferrer">Node API</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
