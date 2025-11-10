import React, { useState, useEffect } from 'react';
import { apiPath } from '../config';
import { ChainMetrics } from '../hooks/useChainMetrics';

const INFO_ENDPOINT = apiPath('/shadow/info');

interface Props {
  metrics: ChainMetrics | null;
}

export default function Privacy({ metrics }: Props) {
  const [poolData, setPoolData] = useState<any>(null);
  const [privacyInfo, setPrivacyInfo] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const infoRes = await fetch(INFO_ENDPOINT);
        const infoData = await infoRes.json();
        setPrivacyInfo(infoData.privacy);
        setPoolData(infoData);
      } catch (err) {
        console.error('Failed to load privacy data:', err);
      }
    };

    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Sapling Shielded Pool</h1>
        <p>Privacy layer</p>
      </div>

      {/* Shielded Pool Overview */}
      <div className="pool-overview-grid">
        <div className="pool-stat-card large">
          <div className="pool-stat-icon">SHIELD</div>
          <div className="pool-stat-value">{privacyInfo?.shield_operations?.toLocaleString() || 0}</div>
          <div className="pool-stat-label">Shield Operations (t→z)</div>
        </div>
        <div className="pool-stat-card large">
          <div className="pool-stat-icon">PRIVATE</div>
          <div className="pool-stat-value">{privacyInfo?.private_transfers?.toLocaleString() || 0}</div>
          <div className="pool-stat-label">Private Transfers (z→z)</div>
        </div>
        <div className="pool-stat-card large">
          <div className="pool-stat-icon">UNSHIELD</div>
          <div className="pool-stat-value">{privacyInfo?.unshield_operations?.toLocaleString() || 0}</div>
          <div className="pool-stat-label">Unshield Operations (z→t)</div>
        </div>
        <div className="pool-stat-card large">
          <div className="pool-stat-icon">VALUE</div>
          <div className="pool-stat-value">
            {Math.max(0, ((privacyInfo?.shielded_pool_value || 0) / 1_000_000_000)).toFixed(0)}
          </div>
          <div className="pool-stat-label">SHOL in Pool</div>
        </div>
      </div>

      {/* Merkle Tree */}
      <div className="merkle-section">
        <h2>Note Commitment Tree</h2>
        <div className="merkle-stats">
          <div className="merkle-stat">
            <span>Tree Depth</span>
            <span className="merkle-value">{privacyInfo?.merkle_tree_depth || 20} levels</span>
          </div>
          <div className="merkle-stat">
            <span>Total Leaves</span>
            <span className="merkle-value">{privacyInfo?.merkle_tree_size?.toLocaleString() || 0}</span>
          </div>
          <div className="merkle-stat">
            <span>Current Root</span>
            <span className="merkle-value root">{poolData?.stats?.merkle_root?.slice(0, 16) || 'N/A'}...</span>
          </div>
        </div>
        <div className="merkle-visual">
          <div className="merkle-tree-placeholder">
            <div className="tree-level">
              <div className="tree-node root">ROOT</div>
            </div>
            <div className="tree-level">
              <div className="tree-node">L1</div>
              <div className="tree-node">R1</div>
            </div>
            <div className="tree-level">
              <div className="tree-node">L2</div>
              <div className="tree-node">M1</div>
              <div className="tree-node">M2</div>
              <div className="tree-node">R2</div>
            </div>
            <div className="tree-info">
              {privacyInfo?.merkle_tree_size?.toLocaleString() || 0} note commitments
            </div>
          </div>
        </div>
      </div>

      {/* Nullifier Set */}
      <div className="nullifier-section">
        <h2>Nullifier Set</h2>
        <div className="nullifier-grid">
          <div className="nullifier-stat-card">
            <div className="nullifier-label">Total Nullifiers</div>
            <div className="nullifier-value">{privacyInfo?.spent_notes?.toLocaleString() || 0}</div>
          </div>
          <div className="nullifier-stat-card">
            <div className="nullifier-label">Active Notes</div>
            <div className="nullifier-value">{privacyInfo?.active_notes?.toLocaleString() || 0}</div>
          </div>
          <div className="nullifier-stat-card">
            <div className="nullifier-label">Anonymity Set</div>
            <div className="nullifier-value">{privacyInfo?.anonymity_set_size?.toLocaleString() || 0}</div>
          </div>
          <div className="nullifier-stat-card">
            <div className="nullifier-label">Privacy Score</div>
            <div className="nullifier-value">{privacyInfo?.privacy_score || 0}/100</div>
          </div>
        </div>
      </div>

      {/* Sapling Circuit Performance */}
      <div className="sapling-performance">
        <h2>Sapling Circuit Performance</h2>
        <div className="sapling-grid">
          <div className="sapling-card">
            <h4>Spend Proofs</h4>
            <div className="sapling-value">{poolData?.sapling?.spend_proofs?.toLocaleString() || 0}</div>
            <div className="sapling-detail">Avg: {poolData?.sapling?.avg_spend_proof_time || 0}s</div>
          </div>
          <div className="sapling-card">
            <h4>Output Proofs</h4>
            <div className="sapling-value">{poolData?.sapling?.output_proofs?.toLocaleString() || 0}</div>
            <div className="sapling-detail">Avg: {poolData?.sapling?.avg_output_proof_time || 0}s</div>
          </div>
          <div className="sapling-card">
            <h4>Verification</h4>
            <div className="sapling-value">{((poolData?.sapling?.avg_verification_time || 0) * 1000).toFixed(2)}ms</div>
            <div className="sapling-detail">Per proof</div>
          </div>
          <div className="sapling-card">
            <h4>Success Rate</h4>
            <div className="sapling-value">{((poolData?.sapling?.proof_success_rate || 0) * 100).toFixed(2)}%</div>
            <div className="sapling-detail">Proof generation</div>
          </div>
        </div>
      </div>
    </div>
  );
}
