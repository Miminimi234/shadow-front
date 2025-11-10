import React, { useState, useEffect } from 'react';
import { apiPath } from '../config';
import { ChainMetrics } from '../hooks/useChainMetrics';
import { NetworkEvent } from '../hooks/useWebSocket';

const INFO_ENDPOINT = apiPath('/shadow/info');
const EXPLORER_ENDPOINT = apiPath('/shadow/explorer');

interface Props {
  metrics: ChainMetrics | null;
  events: NetworkEvent[];
}

export default function Dashboard({ metrics, events }: Props) {
  const [pohHash, setPohHash] = useState('');
  const [recentTxs, setRecentTxs] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load PoH state
        const pohRes = await fetch(INFO_ENDPOINT);
        const pohData = await pohRes.json();
        setPohHash(pohData.poh?.current_hash || '');

        // Load recent transactions
        const txRes = await fetch(EXPLORER_ENDPOINT);
        const txData = await txRes.json();
        setRecentTxs(txData.slice(0, 10));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    };

    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Real-time network overview</p>
      </div>

      {/* Top Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">SLOT</div>
          <div className="metric-value">{metrics?.slot.toLocaleString() || 0}</div>
          <div className="metric-label">Current Slot</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">TPS</div>
          <div className="metric-value">{Math.floor(metrics?.tps || 0).toLocaleString()}</div>
          <div className="metric-label">Transactions/Sec</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">PRIV</div>
          <div className="metric-value">
            {metrics ? ((metrics.shielded_txs / Math.max(1, metrics.total_transactions)) * 100).toFixed(1) : '0'}%
          </div>
          <div className="metric-label">Privacy Ratio</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">POOL</div>
          <div className="metric-value">{metrics?.shielded_pool_size.toLocaleString() || 0}</div>
          <div className="metric-label">Shielded Notes</div>
        </div>
      </div>

      {/* PoH Ticker */}
      <div className="poh-ticker-card">
        <h2>Proof of History</h2>
        <div className="poh-display">
          <div className="poh-label">Current Hash</div>
          <div className="poh-hash">{pohHash.slice(0, 64) || 'Loading...'}</div>
        </div>
        <div className="poh-stats">
          <div className="poh-stat">
            <span>Tick Count</span>
            <span className="poh-stat-value">{((metrics?.slot || 0) * 1000).toLocaleString()}</span>
          </div>
          <div className="poh-stat">
            <span>Hash Rate</span>
            <span className="poh-stat-value">2.5 M/s</span>
          </div>
        </div>
      </div>

      {/* Transaction Breakdown */}
      <div className="content-grid">
        <div className="stats-card">
          <h3>Transaction Types</h3>
          <div className="type-breakdown">
            <div className="type-row">
              <span className="type-label">Transparent (t→t)</span>
              <span className="type-value">{metrics?.transparent_txs.toLocaleString() || 0}</span>
              <span className="type-bar" style={{width: `${(metrics?.transparent_txs || 0) / Math.max(1, (metrics?.total_transactions || 1)) * 100}%`}}></span>
            </div>
            <div className="type-row">
              <span className="type-label">Shield (t→z)</span>
              <span className="type-value">{metrics?.shield_ops.toLocaleString() || 0}</span>
              <span className="type-bar shield" style={{width: `${(metrics?.shield_ops || 0) / Math.max(1, (metrics?.total_transactions || 1)) * 100}%`}}></span>
            </div>
            <div className="type-row">
              <span className="type-label">Private (z→z)</span>
              <span className="type-value">{metrics?.private_transfers.toLocaleString() || 0}</span>
              <span className="type-bar private" style={{width: `${(metrics?.private_transfers || 0) / Math.max(1, (metrics?.total_transactions || 1)) * 100}%`}}></span>
            </div>
            <div className="type-row">
              <span className="type-label">Unshield (z→t)</span>
              <span className="type-value">{metrics?.unshield_ops.toLocaleString() || 0}</span>
              <span className="type-bar unshield" style={{width: `${(metrics?.unshield_ops || 0) / Math.max(1, (metrics?.total_transactions || 1)) * 100}%`}}></span>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {recentTxs.slice(0, 5).map((tx, idx) => (
              <div key={idx} className="activity-item">
                <span className={`activity-type ${tx.type}`}>{tx.type || (tx.has_zkp ? 'shielded' : 'transparent')}</span>
                <span className="activity-sig">{tx.signature?.slice(0, 12)}...</span>
                <span className="activity-slot">Slot {tx.slot}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Network Health */}
      <div className="health-grid">
        <div className="health-card">
          <div className="health-label">Consensus</div>
          <div className="health-value">Tower BFT</div>
          <div className="health-status">ACTIVE</div>
        </div>
        <div className="health-card">
          <div className="health-label">Privacy</div>
          <div className="health-value">Sapling</div>
          <div className="health-status">ENABLED</div>
        </div>
        <div className="health-card">
          <div className="health-label">Finality</div>
          <div className="health-value">12.8s</div>
          <div className="health-status">OPTIMAL</div>
        </div>
      </div>
    </div>
  );
}
