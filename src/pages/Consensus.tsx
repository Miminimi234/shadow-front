import React, { useState, useEffect } from 'react';
import { apiPath } from '../config';
import { ChainMetrics } from '../hooks/useChainMetrics';

const INFO_ENDPOINT = apiPath('/shadow/info');
const VALIDATORS_ENDPOINT = apiPath('/shadow/validators');

interface Props {
  metrics: ChainMetrics | null;
}

export default function Consensus({ metrics }: Props) {
  const [pohData, setPohData] = useState<any>(null);
  const [validators, setValidators] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pohRes, valRes] = await Promise.all([
          fetch(INFO_ENDPOINT),
          fetch(VALIDATORS_ENDPOINT).catch(() => ({ json: async () => null }))
        ]);
        
        const pohInfo = await pohRes.json();
        setPohData(pohInfo.poh);
        
        const valData = await valRes.json();
        if (valData?.validators) {
          setValidators(valData.validators);
        }
      } catch (err) {
        console.error('Failed to load consensus data:', err);
      }
    };

    loadData();
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Consensus Layer</h1>
        <p>Proof of History + Tower BFT</p>
      </div>

      {/* PoH Visualizer */}
      <div className="poh-visualizer">
        <h2>Proof of History Stream</h2>
        <div className="poh-stream-container">
          <div className="poh-current">
            <div className="poh-hash-label">CURRENT POH HASH</div>
            <div className="poh-hash-display">{pohData?.current_hash || 'Generating...'}</div>
            <div className="poh-tick-display">Tick: {pohData?.tick_count.toLocaleString() || 0}</div>
          </div>
          <div className="poh-info-grid">
            <div className="poh-info-item">
              <span>Hashes/Slot</span>
              <span className="poh-info-value">{pohData?.hashes_per_slot || 1000}</span>
            </div>
            <div className="poh-info-item">
              <span>Hash Rate</span>
              <span className="poh-info-value">{((pohData?.hash_rate || 0) / 1_000_000).toFixed(1)} M/s</span>
            </div>
            <div className="poh-info-item">
              <span>Current Leader</span>
              <span className="poh-info-value leader">{pohData?.leader || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tower BFT */}
      <div className="tower-bft-section">
        <h2>Tower BFT Consensus</h2>
        <div className="consensus-stats-grid">
          <div className="consensus-stat-card">
            <div className="consensus-stat-label">Total Stake</div>
            <div className="consensus-stat-value">
              {((metrics?.total_stake || 0) / 1e15).toFixed(1)} M
            </div>
            <div className="consensus-stat-sub">SHOL staked</div>
          </div>
          <div className="consensus-stat-card">
            <div className="consensus-stat-label">Active Validators</div>
            <div className="consensus-stat-value">{metrics?.active_validators || 0}</div>
            <div className="consensus-stat-sub">Producing blocks</div>
          </div>
          <div className="consensus-stat-card">
            <div className="consensus-stat-label">Finality Threshold</div>
            <div className="consensus-stat-value">66.67%</div>
            <div className="consensus-stat-sub">Stake required</div>
          </div>
          <div className="consensus-stat-card">
            <div className="consensus-stat-label">Leader Rotation</div>
            <div className="consensus-stat-value">4 slots</div>
            <div className="consensus-stat-sub">~1.6 seconds</div>
          </div>
        </div>
      </div>

      {/* Slot Production */}
      <div className="slot-production">
        <h2>Slot Production</h2>
        <div className="slot-info-grid">
          <div className="slot-info-large">
            <div className="slot-number">{metrics?.slot.toLocaleString() || 0}</div>
            <div className="slot-label">CURRENT SLOT</div>
          </div>
          <div className="slot-details">
            <div className="slot-detail-row">
              <span>Epoch</span>
              <span>{metrics?.epoch || 0}</span>
            </div>
            <div className="slot-detail-row">
              <span>Slot in Epoch</span>
              <span>{metrics ? (metrics.slot % 432000).toLocaleString() : 0}</span>
            </div>
            <div className="slot-detail-row">
              <span>Slot Time</span>
              <span>400ms</span>
            </div>
            <div className="slot-detail-row">
              <span>Slots to Finality</span>
              <span>32 (~12.8s)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Validator Quick View */}
      {validators.length > 0 && (
        <div className="validator-preview">
          <h2>Active Validators</h2>
          <div className="validator-mini-grid">
            {validators.slice(0, 6).map((val, idx) => (
              <div key={idx} className={`validator-mini ${val.is_leader ? 'leader' : ''}`}>
                <div className="validator-mini-id">{val.identity}</div>
                <div className="validator-mini-stake">
                  {((val.stake || 0) / 1e15).toFixed(1)}M SHOL
                </div>
                {val.is_leader && <div className="leader-badge">LEADER</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
