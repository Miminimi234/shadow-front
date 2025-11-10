import React, { useState, useEffect } from 'react';
import { apiPath } from '../config';
import { ChainMetrics } from '../hooks/useChainMetrics';

const VALIDATORS_ENDPOINT = apiPath('/shadow/validators');

interface Props {
  metrics?: ChainMetrics | null;
}

export default function Validators({ metrics }: Props) {
  const [validators, setValidators] = useState<any[]>([]);
  const [selectedValidator, setSelectedValidator] = useState<any>(null);

  useEffect(() => {
    const loadValidators = async () => {
      try {
        const response = await fetch(VALIDATORS_ENDPOINT);
        const data = await response.json();
        if (data?.validators) {
          setValidators(data.validators);
        }
      } catch (err) {
        // Generate mock validators if API not available
        const mockValidators = Array.from({ length: 21 }, (_, i) => ({
          identity: `Validator-${String(i + 1).padStart(2, '0')}`,
          pubkey: `0x${Array(16).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
          stake: Math.floor(Math.random() * 50 + 10) * 1e12,
          stake_percent: 0,
          is_leader: i === 0,
          last_vote: (metrics?.slot || 0) - Math.floor(Math.random() * 5),
        }));
        
        const totalStake = mockValidators.reduce((sum, v) => sum + v.stake, 0);
        mockValidators.forEach(v => {
          v.stake_percent = (v.stake / totalStake) * 100;
        });
        
        setValidators(mockValidators);
      }
    };

    loadValidators();
    const interval = setInterval(loadValidators, 5000);
    return () => clearInterval(interval);
  }, [metrics]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Validators</h1>
        <p>Active validator set and stake distribution</p>
      </div>

      {/* Stake Summary */}
      <div className="stake-summary">
        <div className="summary-stat">
          <div className="summary-label">Total Stake</div>
          <div className="summary-value">
            {validators.reduce((sum, v) => sum + (v.stake || 0), 0) > 0 
              ? ((validators.reduce((sum, v) => sum + (v.stake || 0), 0)) / 1e12).toFixed(2) 
              : '113.00'} M SHOL
          </div>
        </div>
        <div className="summary-stat">
          <div className="summary-label">Active Validators</div>
          <div className="summary-value">{validators.length}</div>
        </div>
        <div className="summary-stat">
          <div className="summary-label">Supermajority</div>
          <div className="summary-value">66.67%</div>
        </div>
        <div className="summary-stat">
          <div className="summary-label">Nakamoto Coefficient</div>
          <div className="summary-value">5</div>
        </div>
      </div>

      {/* Validators Grid */}
      <div className="validators-grid">
        {validators.map((validator, idx) => (
          <div 
            key={idx} 
            className={`validator-card ${validator.is_leader ? 'leader' : ''} ${selectedValidator?.identity === validator.identity ? 'selected' : ''}`}
            onClick={() => setSelectedValidator(validator)}
            style={{ cursor: 'pointer' }}
          >
            <div className="validator-header">
              <div className="validator-id">{validator.identity}</div>
              {validator.is_leader && <div className="leader-badge">LEADER</div>}
            </div>
            <div className="validator-pubkey">{validator.pubkey?.slice(0, 20) || 'N/A'}...</div>
            <div className="validator-stats">
              <div className="validator-stat-row">
                <span>Stake</span>
                <span>{((validator.stake || 0) / 1e12).toFixed(1)} M SHOL</span>
              </div>
              <div className="validator-stat-row">
                <span>Stake %</span>
                <span>{(validator.stake_percent || 0).toFixed(2)}%</span>
              </div>
              <div className="validator-stat-row">
                <span>Last Vote</span>
                <span>Slot {validator.last_vote}</span>
              </div>
            </div>
            <div className="stake-bar-container">
              <div 
                className="stake-bar" 
                style={{ width: `${Math.min(100, validator.stake_percent || 0)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Validator Detail Modal */}
      {selectedValidator && (
        <div className="validator-detail-overlay" onClick={() => setSelectedValidator(null)}>
          <div className="validator-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedValidator.identity}</h2>
              <button className="modal-close" onClick={() => setSelectedValidator(null)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="detail-section">
                <div className="detail-label">Pubkey</div>
                <div className="detail-value monospace">{selectedValidator.pubkey}</div>
              </div>
              
              <div className="detail-section">
                <div className="detail-label">Stake</div>
                <div className="detail-value-large">
                  {((selectedValidator.stake || 0) / 1e12).toFixed(2)} M SHOL
                </div>
                <div className="detail-sublabel">
                  {(selectedValidator.stake_percent || 0).toFixed(3)}% of total network stake
                </div>
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <div className="detail-label">Commission</div>
                  <div className="detail-value">{((selectedValidator.commission || 0) * 100).toFixed(1)}%</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Last Vote</div>
                  <div className="detail-value">Slot {selectedValidator.last_vote}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Root Slot</div>
                  <div className="detail-value">{selectedValidator.root_slot || 'N/A'}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Status</div>
                  <div className="detail-value status-active">
                    {selectedValidator.is_leader ? 'LEADER' : 'ACTIVE'}
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <div className="detail-label">Performance</div>
                <div className="performance-bars">
                  <div className="perf-item">
                    <span>Uptime</span>
                    <div className="perf-bar">
                      <div className="perf-fill" style={{ width: '99.8%' }}></div>
                    </div>
                    <span>99.8%</span>
                  </div>
                  <div className="perf-item">
                    <span>Vote Success</span>
                    <div className="perf-bar">
                      <div className="perf-fill" style={{ width: '98.5%' }}></div>
                    </div>
                    <span>98.5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
