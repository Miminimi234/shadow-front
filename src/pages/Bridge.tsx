import React, { useState, useEffect, useCallback } from 'react';
import { apiPath } from '../config';

interface BridgeDeposit {
  bridge_id: string;
  depositor: string;
  amount: number;
  deposit_slot: number;
  status: any;
  privacy_config: PrivacyConfig;
  mixing_hops_completed: number;
  total_hops: number;
  anonymity_set_size: number;
  privacy_score: number;
  withdrawal_address?: string;
}

interface PrivacyConfig {
  hops: number;
  decoy_multiplier: number;
  delay_hours: number;
  split_count: number;
}

interface BridgeStats {
  total_volume: number;
  active_deposits: number;
  anonymity_set: number;
  average_delay_hours: number;
}

export default function Bridge() {
  const [view, setView] = useState<'deposit' | 'withdraw' | 'history'>('deposit');
  const [stats, setStats] = useState<BridgeStats | null>(null);

  const loadStats = useCallback(async () => {
    try {
      const response = await fetch(apiPath('/bridge/stats'));
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to load bridge stats:', err);
    }
  }, []);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, [loadStats]);

  return (
    <div className="page-container">
      <div className="page-header bridge-header">
        <h1>SHADOWCHAIN BRIDGE</h1>
        <p>Break transaction links - Complete privacy</p>
      </div>

      {stats && (
        <div className="stats-banner">
          <div className="stat-card-banner">
            <div className="stat-value-banner">{(stats.total_volume / 1e9).toFixed(0)}</div>
            <div className="stat-label-banner">Total Volume (SHOL)</div>
          </div>
          <div className="stat-card-banner">
            <div className="stat-value-banner">{stats.active_deposits}</div>
            <div className="stat-label-banner">Active Deposits</div>
          </div>
          <div className="stat-card-banner">
            <div className="stat-value-banner">{stats.anonymity_set.toLocaleString()}</div>
            <div className="stat-label-banner">Anonymity Set</div>
          </div>
          <div className="stat-card-banner">
            <div className="stat-value-banner">{stats.average_delay_hours.toFixed(1)}h</div>
            <div className="stat-label-banner">Avg Delay</div>
          </div>
        </div>
      )}

      <div className="bridge-tabs">
        <button
          className={`bridge-tab ${view === 'deposit' ? 'active' : ''}`}
          onClick={() => setView('deposit')}
        >
          DEPOSIT
        </button>
        <button
          className={`bridge-tab ${view === 'withdraw' ? 'active' : ''}`}
          onClick={() => setView('withdraw')}
        >
          WITHDRAW
        </button>
        <button
          className={`bridge-tab ${view === 'history' ? 'active' : ''}`}
          onClick={() => setView('history')}
        >
          HISTORY
        </button>
      </div>

      <div className="bridge-content">
        {view === 'deposit' && <DepositView />}
        {view === 'withdraw' && <WithdrawView />}
        {view === 'history' && <HistoryView />}
      </div>
    </div>
  );
}

function DepositView() {
  const [amount, setAmount] = useState('');
  const [fromAddress, setFromAddress] = useState('');
  const [privacyLevel, setPrivacyLevel] = useState<'fast' | 'standard' | 'maximum'>('standard');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bridgeId, setBridgeId] = useState<string | null>(null);

  const privacyLevels = {
    fast: { hops: 5, time: '1 minute', decoys: '5x' },
    standard: { hops: 10, time: '1 hour', decoys: '10x' },
    maximum: { hops: 20, time: '24 hours', decoys: '20x' },
  };

  const handleDeposit = async () => {
    if (!amount || !fromAddress) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(apiPath('/bridge/deposit'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          depositor: fromAddress,
          amount: parseFloat(amount) * 1e9,
          privacy_level: privacyLevel,
        }),
      });

      const data = await response.json();

      if (data.success && data.bridge_id) {
        setBridgeId(data.bridge_id);
      } else {
        alert(data.error || 'Failed to create bridge deposit');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to create bridge deposit');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bridgeId) {
    return <ProcessingView bridgeId={bridgeId} />;
  }

  return (
    <div className="bridge-form">
      <h2>Step 1: Deposit</h2>

      <div className="form-group">
        <label>Amount to Bridge</label>
        <div className="input-with-suffix">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100"
          />
          <span className="suffix">SHOL</span>
        </div>
      </div>

      <div className="form-group">
        <label>From Address</label>
        <input
          type="text"
          value={fromAddress}
          onChange={(e) => setFromAddress(e.target.value)}
          placeholder="sol1abc123..."
        />
      </div>

      <div className="form-group">
        <label>Privacy Level</label>
        <div className="privacy-levels">
          {Object.entries(privacyLevels).map(([level, config]) => (
            <button
              key={level}
              className={`privacy-level-btn ${privacyLevel === level ? 'active' : ''}`}
              onClick={() => setPrivacyLevel(level as any)}
            >
              <div className="level-name">{level.toUpperCase()}</div>
              <div className="level-details">
                <div>{config.hops} hops</div>
                <div>{config.time}</div>
                <div>{config.decoys} decoys</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        className="advanced-toggle"
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        {showAdvanced ? '▼' : '▶'} Advanced Options
      </button>

      {showAdvanced && (
        <div className="advanced-options">
          <div className="info-box">
            <h4>How the Bridge Works:</h4>
            <ol>
              <li>Your funds are split into multiple shielded notes</li>
              <li>Each note goes through {privacyLevels[privacyLevel].hops} mixing hops</li>
              <li>System generates {privacyLevels[privacyLevel].decoys} decoy transactions</li>
              <li>Wait {privacyLevels[privacyLevel].time} for maximum privacy</li>
              <li>Withdraw to any address with no on-chain link</li>
            </ol>
          </div>
        </div>
      )}

      <button
        className="submit-button"
        onClick={handleDeposit}
        disabled={isSubmitting || !amount || !fromAddress}
      >
        {isSubmitting ? (
          <>
            <span className="spinner"></span>
            Depositing...
          </>
        ) : (
          'DEPOSIT & SHIELD'
        )}
      </button>

      <div className="warning-box">
        <strong>IMPORTANT:</strong> Save your Bridge ID after deposit!
        You'll need it to withdraw.
      </div>
    </div>
  );
}

function ProcessingView({ bridgeId }: { bridgeId: string }) {
  const [deposit, setDeposit] = useState<BridgeDeposit | null>(null);

  const loadDeposit = useCallback(async () => {
    try {
      const response = await fetch(apiPath(`/bridge/status/${bridgeId}`));
      const data = await response.json();
      setDeposit(data);
    } catch (err) {
      console.error('Failed to load deposit:', err);
    }
  }, [bridgeId]);

  useEffect(() => {
    loadDeposit();
    const interval = setInterval(loadDeposit, 2000);
    return () => clearInterval(interval);
  }, [bridgeId, loadDeposit]);

  if (!deposit) {
    return <div className="loading-spinner">Loading...</div>;
  }

  const getStatusText = () => {
    if (typeof deposit.status === 'string') {
      return deposit.status;
    }
    if (deposit.status.Mixing) {
      return `Mixing (Hop ${deposit.status.Mixing.current_hop}/${deposit.status.Mixing.total_hops})`;
    }
    if (deposit.status.WaitingDelay) {
      return 'Waiting for delay period';
    }
    return 'Processing';
  };

  const progress = (deposit.mixing_hops_completed / deposit.total_hops) * 100;

  return (
    <div className="processing-view">
      <h2>MIXING IN PROGRESS</h2>

      <div className="bridge-id-box">
        <label>Your Bridge ID:</label>
        <code>{deposit.bridge_id}</code>
        <button onClick={() => navigator.clipboard.writeText(deposit.bridge_id)}>
          COPY
        </button>
      </div>

      <div className="status-display">
        <div className="status-icon">
          {deposit.status === 'ReadyToWithdraw' ? '✓' : '⟳'}
        </div>
        <div className="status-text">{getStatusText()}</div>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="progress-text">{progress.toFixed(0)}%</div>

      <div className="timeline">
        <TimelineItem
          icon="✓"
          label="Deposited"
          status="complete"
        />
        <TimelineItem
          icon={deposit.mixing_hops_completed > 0 ? '✓' : '⧗'}
          label={`Mixing (${deposit.mixing_hops_completed}/${deposit.total_hops} hops)`}
          status={deposit.mixing_hops_completed > 0 ? 'active' : 'pending'}
        />
        <TimelineItem
          icon={deposit.status === 'ReadyToWithdraw' ? '✓' : '⧗'}
          label={`Delay (${deposit.privacy_config.delay_hours}h)`}
          status={deposit.status === 'ReadyToWithdraw' ? 'complete' : 'pending'}
        />
        <TimelineItem
          icon={deposit.status === 'ReadyToWithdraw' ? '✓' : '⧗'}
          label="Ready to Withdraw"
          status={deposit.status === 'ReadyToWithdraw' ? 'complete' : 'pending'}
        />
      </div>

      <div className="anonymity-box">
        <h4>Privacy Metrics</h4>
        <div className="metric-row">
          <span>Anonymity Set:</span>
          <strong>{deposit.anonymity_set_size.toLocaleString()} transactions</strong>
        </div>
        <div className="metric-row">
          <span>Privacy Score:</span>
          <strong>{deposit.privacy_score}/100</strong>
        </div>
        <p className="privacy-note">
          Your transaction is hidden among {deposit.anonymity_set_size.toLocaleString()} others
        </p>
      </div>

      {deposit.status === 'ReadyToWithdraw' && (
        <div className="ready-box">
          <h3>✓ Ready to Withdraw!</h3>
          <p>Your funds are ready. Go to the Withdraw tab to complete the process.</p>
        </div>
      )}
    </div>
  );
}

function TimelineItem({
  icon,
  label,
  status,
}: {
  icon: string;
  label: string;
  status: 'complete' | 'active' | 'pending';
}) {
  return (
    <div className={`timeline-item ${status}`}>
      <div className="timeline-icon">{icon}</div>
      <div className="timeline-label">{label}</div>
    </div>
  );
}

function WithdrawView() {
  const [bridgeId, setBridgeId] = useState('');
  const [withdrawalAddress, setWithdrawalAddress] = useState('');
  const [deposit, setDeposit] = useState<BridgeDeposit | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const checkStatus = async () => {
    if (!bridgeId) return;

    setIsLoading(true);
    try {
      const response = await fetch(apiPath(`/bridge/status/${bridgeId}`));
      const data = await response.json();
      setDeposit(data);
    } catch (error) {
      alert('Bridge ID not found');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!bridgeId || !withdrawalAddress) return;

    setIsWithdrawing(true);
    try {
      const response = await fetch(apiPath('/bridge/withdraw'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bridge_id: bridgeId,
          withdrawal_address: withdrawalAddress,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('✓ Withdrawal complete! Your funds are now in the destination address.');
        setBridgeId('');
        setWithdrawalAddress('');
        setDeposit(null);
      } else {
        alert(data.error || 'Withdrawal failed');
      }
    } catch (error) {
      console.error(error);
      alert('Withdrawal failed');
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="bridge-form">
      <h2>Step 2: Withdraw</h2>

      <div className="form-group">
        <label>Bridge ID</label>
        <div className="input-with-button">
          <input
            type="text"
            value={bridgeId}
            onChange={(e) => setBridgeId(e.target.value)}
            placeholder="bridge_a1b2c3d4"
          />
          <button onClick={checkStatus} disabled={isLoading}>
            {isLoading ? 'Checking...' : 'Check Status'}
          </button>
        </div>
      </div>

      {deposit && (
        <div className="deposit-status">
          <div className={`status-badge ${deposit.status === 'ReadyToWithdraw' ? 'ready' : 'not-ready'}`}>
            {deposit.status === 'ReadyToWithdraw' ? '✓ Ready to Withdraw' : '⧗ Not Ready Yet'}
          </div>

          <div className="deposit-details">
            <div className="detail-row">
              <span>Amount Available:</span>
              <strong>{((deposit.amount * 0.9995) / 1e9).toFixed(2)} SHOL</strong>
            </div>
            <div className="detail-row">
              <span>Privacy Score:</span>
              <strong>{deposit.privacy_score}/100</strong>
            </div>
            <div className="detail-row">
              <span>Anonymity Set:</span>
              <strong>{deposit.anonymity_set_size.toLocaleString()}</strong>
            </div>
          </div>

          {deposit.status === 'ReadyToWithdraw' && (
            <>
              <div className="form-group">
                <label>Withdrawal Address</label>
                <input
                  type="text"
                  value={withdrawalAddress}
                  onChange={(e) => setWithdrawalAddress(e.target.value)}
                  placeholder="shadow1xyz789... or sol1abc123..."
                />
              </div>

              <div className="warning-box">
                <strong>IMPORTANT:</strong> After withdrawal, there is NO on-chain
                link between your deposit and this address. Your privacy is complete.
              </div>

              <button
                className="submit-button"
                onClick={handleWithdraw}
                disabled={isWithdrawing || !withdrawalAddress}
              >
                {isWithdrawing ? (
                  <>
                    <span className="spinner"></span>
                    Withdrawing...
                  </>
                ) : (
                  'WITHDRAW PRIVATELY'
                )}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function HistoryView() {
  const [address, setAddress] = useState('');
  const [history, setHistory] = useState<BridgeDeposit[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadHistory = async () => {
    if (!address) return;

    setIsLoading(true);
    try {
      const response = await fetch(apiPath(`/bridge/history/${address}`));
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bridge-form">
      <h2>Your Bridge Transactions</h2>

      <div className="form-group">
        <label>Your Address</label>
        <div className="input-with-button">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="sol1abc123..."
          />
          <button onClick={loadHistory} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Load History'}
          </button>
        </div>
      </div>

      {history.length > 0 && (
        <div className="history-list">
          {history.map((deposit) => (
            <div key={deposit.bridge_id} className="history-item">
              <div className="history-header">
                <span className="bridge-id-display">{deposit.bridge_id}</span>
                <span className={`status-badge ${deposit.status === 'Completed' ? 'complete' : 'active'}`}>
                  {typeof deposit.status === 'string' ? deposit.status : 'Processing'}
                </span>
              </div>
              <div className="history-details">
                <div>Amount: {(deposit.amount / 1e9).toFixed(2)} SHOL</div>
                <div>Privacy Score: {deposit.privacy_score}/100</div>
                <div>Anonymity Set: {deposit.anonymity_set_size.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {history.length === 0 && !isLoading && address && (
        <div className="empty-state">
          <p>No bridge transactions found for this address.</p>
        </div>
      )}
    </div>
  );
}
