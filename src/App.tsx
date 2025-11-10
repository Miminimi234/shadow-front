import { useState } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import headerLogo from './assets/shadowlogo.png';
import PoHBackground from './components/PoHBackground';
import { apiPath } from './config';
import { ChainMetrics, useChainMetrics } from './hooks/useChainMetrics';
import { useWebSocket } from './hooks/useWebSocket';
import Bridge from './pages/Bridge';
import Consensus from './pages/Consensus';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import PoHPreview from './pages/PoHPreview';
import Privacy from './pages/Privacy';
import Transactions from './pages/Transactions';
import Validators from './pages/Validators';
import Wallet from './pages/Wallet';
import './shadow-theme.css';

const NODE_API_LINK = apiPath('/shadow/info');

const NAV_ITEMS = [
  { path: '/dashboard', icon: 'DASH', label: 'Dashboard' },
  { path: '/consensus', icon: 'POH', label: 'Consensus' },
  { path: '/privacy', icon: 'PRIV', label: 'Privacy Pool' },
  { path: '/transactions', icon: 'TX', label: 'Transactions' },
  { path: '/wallet', icon: 'WALL', label: 'Wallet' },
  { path: '/validators', icon: 'VAL', label: 'Validators' },
  { path: '/bridge', icon: 'BRDG', label: 'Bridge' },
];

interface AppLayoutProps {
  metrics: ChainMetrics | null;
  loading: boolean;
}

const AppLayout = ({ metrics, loading }: AppLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const formatNumber = (num: number | null | undefined) => {
    if (!num && num !== 0) return '0';
    return num.toLocaleString();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleReturnToLanding = () => {
    setMobileMenuOpen(false);
    navigate('/');
  };

  const shieldedRatio = metrics
    ? ((metrics.shielded_txs / Math.max(1, metrics.total_transactions)) * 100).toFixed(1)
    : '0';

  return (
    <div className="app-container">
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
            <span></span>
            <span></span>
            <span></span>
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

      <div className="main-layout">
        <aside id="app-sidebar" className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
          <nav className="sidebar-nav">
            {NAV_ITEMS.map(item => (
              <button
                key={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => handleNavigation(item.path)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-stats">
            <div className="quick-stat">
              <div className="quick-stat-label">Shielded Ratio</div>
              <div className="quick-stat-value">{shieldedRatio}%</div>
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

        <main className="main-content">
          {loading ? (
            <div className="loading-screen">
              <div className="spinner-large"></div>
              <p>Loading ShadowChain...</p>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>

      <footer className="app-footer">
        <div className="footer-left">
          <span>SHADOWCHAIN v1.0.0</span>
          <span className="separator">|</span>
          <span>Solana PoH + Sapling Privacy</span>
        </div>
        <div className="footer-right">
          <button
            onClick={() => handleNavigation('/wallet')}
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
};

const LandingRoute = () => {
  const navigate = useNavigate();

  const handleLaunchApp = () => {
    localStorage.setItem('shadowchain_visited', 'true');
    navigate('/dashboard');
  };

  return (
    <>
      <PoHBackground />
      <Landing onLaunch={handleLaunchApp} />
    </>
  );
};

function App() {
  const { metrics, loading } = useChainMetrics();
  const events = useWebSocket();

  return (
    <Routes>
      <Route path="/" element={<LandingRoute />} />
      <Route path="/poh" element={<PoHPreview />} />
      <Route element={<AppLayout metrics={metrics} loading={loading} />}>
        <Route path="/dashboard" element={<Dashboard metrics={metrics} events={events} />} />
        <Route path="/consensus" element={<Consensus metrics={metrics} />} />
        <Route path="/privacy" element={<Privacy metrics={metrics} />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/validators" element={<Validators />} />
        <Route path="/bridge" element={<Bridge />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
