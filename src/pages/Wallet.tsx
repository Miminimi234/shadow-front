import { useState } from 'react';
import { apiPath } from '../config';

const GENERATE_ADDRESS_ENDPOINT = apiPath('/address/generate');
const faucetEndpoint = (address: string) => apiPath(`/faucet/${address}`);

export default function Wallet() {
  const [transparentAddress, setTransparentAddress] = useState('');
  const [shieldedAddress, setShieldedAddress] = useState<any>(null);
  const [balance, setBalance] = useState({ transparent: 0, shielded: 0 });
  const [faucetLoading, setFaucetLoading] = useState(false);
  const [faucetMessage, setFaucetMessage] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);
  const [modalAmount, setModalAmount] = useState('1');
  const [modalRecipient, setModalRecipient] = useState('');
  const [modalError, setModalError] = useState('');

  const generateTransparentAddress = () => {
    const randomHex = Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    setTransparentAddress(`sol1${randomHex.slice(0, 32)}`);
  };

  const generateShieldedAddress = async () => {
    try {
      const response = await fetch(GENERATE_ADDRESS_ENDPOINT);
      const address = await response.json();
      setShieldedAddress(address);
    } catch (err) {
      console.error('Failed to generate address:', err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const requestFromFaucet = async (address: string) => {
    setFaucetLoading(true);
    setFaucetMessage('');

    try {
      const response = await fetch(faucetEndpoint(address));
      const data = await response.json();

      if (data.success) {
        setBalance(prev => ({
          ...prev,
          transparent: prev.transparent + data.amount_shol,
        }));
        setFaucetMessage(`✓ Success! Received ${data.amount_shol} SHOL`);
      } else {
        setFaucetMessage('✗ Faucet request failed');
      }
    } catch (err) {
      console.error('Faucet error:', err);
      setFaucetMessage('✗ Faucet unavailable');
    } finally {
      setFaucetLoading(false);
      setTimeout(() => setFaucetMessage(''), 5000);
    }
  };

  // Quick action helpers
  const doPostAction = async (path: string, payload: any) => {
    setActionLoading(true);
    setActionMessage('');
    try {
      const res = await fetch(apiPath(path), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload || {}),
      });
      const data = await res.json();
      setActionMessage(`✓ ${data.type || data.status || 'Success'}: ${data.signature || data.bridge_id || ''}`);
      // clear after a short time
      setTimeout(() => setActionMessage(''), 6000);
      return data;
    } catch (err) {
      console.error('Action error:', err);
      setActionMessage('✗ Action failed');
      setTimeout(() => setActionMessage(''), 6000);
      return null;
    } finally {
      setActionLoading(false);
    }
  };

  const shieldFunds = () => {
    if (!transparentAddress || !shieldedAddress) {
      setActionMessage('✗ Generate both transparent and shielded addresses first');
      setTimeout(() => setActionMessage(''), 4000);
      return;
    }
    setModalType('shield');
    setModalRecipient(shieldedAddress.address || '');
    setModalAmount('1');
    setModalError('');
    setModalOpen(true);
  };

  const unshieldFunds = () => {
    if (!transparentAddress || !shieldedAddress) {
      setActionMessage('✗ Generate both transparent and shielded addresses first');
      setTimeout(() => setActionMessage(''), 4000);
      return;
    }
    setModalType('unshield');
    setModalRecipient(transparentAddress || '');
    setModalAmount('1');
    setModalError('');
    setModalOpen(true);
  };

  const sendPrivate = () => {
    if (!shieldedAddress) {
      setActionMessage('✗ Generate a shielded address first');
      setTimeout(() => setActionMessage(''), 4000);
      return;
    }
    setModalType('private');
    setModalRecipient('');
    setModalAmount('1');
    setModalError('');
    setModalOpen(true);
  };

  const sendPublic = () => {
    if (!transparentAddress) {
      setActionMessage('✗ Generate a transparent address first');
      setTimeout(() => setActionMessage(''), 4000);
      return;
    }
    setModalType('public');
    setModalRecipient('');
    setModalAmount('1');
    setModalError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    setModalAmount('1');
    setModalRecipient('');
    setModalError('');
  };

  const submitModal = async () => {
    setModalError('');
    const amount = parseFloat(modalAmount);
    if (isNaN(amount) || amount <= 0) {
      setModalError('Please enter a valid amount');
      return;
    }

    let payload: any = {};
    let path = '';

    if (modalType === 'shield') {
      path = '/shadow/shield';
      payload = { from: transparentAddress, to: modalRecipient, amount };
    } else if (modalType === 'unshield') {
      path = '/shadow/unshield';
      payload = { from_shielded: shieldedAddress?.address, to: modalRecipient, amount };
    } else if (modalType === 'private') {
      path = '/shadow/transfer/shielded';
      payload = { from: shieldedAddress?.address, to: modalRecipient, amount };
    } else if (modalType === 'public') {
      path = '/shadow/tx';
      payload = { from: transparentAddress, to: modalRecipient, amount };
    } else {
      setModalError('Unknown action');
      return;
    }

    const res = await doPostAction(path, payload);
    if (res) {
      // update balances optimistically
      if (modalType === 'shield') {
        setBalance(b => ({ ...b, transparent: Math.max(0, b.transparent - amount), shielded: b.shielded + amount }));
      } else if (modalType === 'unshield') {
        setBalance(b => ({ ...b, shielded: Math.max(0, b.shielded - amount), transparent: b.transparent + amount }));
      } else if (modalType === 'private') {
        setBalance(b => ({ ...b, shielded: Math.max(0, b.shielded - amount) }));
      } else if (modalType === 'public') {
        setBalance(b => ({ ...b, transparent: Math.max(0, b.transparent - amount) }));
      }
      closeModal();
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Wallet</h1>
        <p>Manage transparent and shielded addresses</p>
      </div>

      {/* Address Generation */}
      <div className="wallet-grid">
        <div className="address-section">
          <h2>Transparent Address</h2>
          <div className="address-card">
            {!transparentAddress ? (
              <div className="address-generate">
                <p>Generate a transparent address (like normal Solana)</p>
                <button className="generate-btn" onClick={generateTransparentAddress}>
                  Generate Transparent Address
                </button>
              </div>
            ) : (
              <div className="address-display">
                <div className="address-label">Address</div>
                <div className="address-value" onClick={() => copyToClipboard(transparentAddress)}>
                  {transparentAddress}
                </div>
                <div className="address-hint">Click to copy</div>
                <div className="balance-display">
                  <div className="balance-label">Balance</div>
                  <div className="balance-value">{balance.transparent} SHOL</div>
                </div>

                <button
                  className="faucet-btn"
                  onClick={() => requestFromFaucet(transparentAddress)}
                  disabled={faucetLoading}
                >
                  {faucetLoading ? 'Requesting...' : 'Request from Faucet (1000 SHOL)'}
                </button>

                {faucetMessage && (
                  <div className={`faucet-message ${faucetMessage.includes('✓') ? 'success' : 'error'}`}>
                    {faucetMessage}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="address-section">
          <h2>Shielded Address</h2>
          <div className="address-card shielded">
            {!shieldedAddress ? (
              <div className="address-generate">
                <p>Generate a shielded address with spending and viewing keys</p>
                <button className="generate-btn shielded" onClick={generateShieldedAddress}>
                  Generate Shielded Address
                </button>
              </div>
            ) : (
              <div className="address-display">
                <div className="address-label">Address</div>
                <div className="address-value" onClick={() => copyToClipboard(shieldedAddress.address)}>
                  {shieldedAddress.address}
                </div>
                <div className="address-hint">Click to copy</div>

                <div className="keys-section">
                  <div className="key-row">
                    <span className="key-label">Spending Key</span>
                    <code className="key-value">{shieldedAddress.spending_key ? `0x${shieldedAddress.spending_key.slice(0, 32)}...` : 'N/A'}</code>
                  </div>
                  <div className="key-row">
                    <span className="key-label">Viewing Key</span>
                    <code className="key-value">{shieldedAddress.viewing_key ? `0x${shieldedAddress.viewing_key.slice(0, 32)}...` : 'N/A'}</code>
                  </div>
                </div>

                <div className="balance-display">
                  <div className="balance-label">Shielded Balance</div>
                  <div className="balance-value private">{balance.shielded} SHOL</div>
                  <div className="balance-note">Requires viewing key to see</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button
            className="action-btn"
            disabled={!transparentAddress || !shieldedAddress || actionLoading}
            onClick={shieldFunds}
          >
            {actionLoading ? 'Working...' : 'Shield Funds (t→z)'}
          </button>
          <button
            className="action-btn"
            disabled={!shieldedAddress || actionLoading}
            onClick={unshieldFunds}
          >
            {actionLoading ? 'Working...' : 'Unshield Funds (z→t)'}
          </button>
          <button
            className="action-btn"
            disabled={!shieldedAddress || actionLoading}
            onClick={sendPrivate}
          >
            {actionLoading ? 'Working...' : 'Send Private (z→z)'}
          </button>
          <button
            className="action-btn"
            disabled={!transparentAddress || actionLoading}
            onClick={sendPublic}
          >
            {actionLoading ? 'Working...' : 'Send Public (t→t)'}
          </button>
        </div>
        {actionMessage && <div className={`action-message ${actionMessage.startsWith('✓') ? 'success' : 'error'}`}>{actionMessage}</div>}
      </div>

      {/* Modal for quick actions */}
      {modalOpen && (
        <div className="validator-detail-overlay" role="dialog" aria-modal="true">
          <div className="validator-detail-modal">
            <div className="modal-header">
              <h2>{modalType === 'shield' ? 'Shield Funds' : modalType === 'unshield' ? 'Unshield Funds' : modalType === 'private' ? 'Send Private' : 'Send Public'}</h2>
              <button className="modal-close" onClick={closeModal} aria-label="Close">×</button>
            </div>
            <div className="modal-body">
              {modalError && <div className="tx-result error">{modalError}</div>}
              <div className="form-field">
                <label>Recipient Address</label>
                <input className="modal-input" value={modalRecipient} onChange={e => setModalRecipient(e.target.value)} placeholder={modalType === 'private' ? 'shadow1...' : modalType === 'public' ? 'sol1...' : ''} />
              </div>
              <div className="form-field">
                <label>Amount (SHOL)</label>
                <input className="modal-input" value={modalAmount} onChange={e => setModalAmount(e.target.value)} />
              </div>
              <div className="modal-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="submit-tx-btn" onClick={submitModal} disabled={actionLoading}>{actionLoading ? 'Working...' : 'Confirm'}</button>
                <button className="generate-btn" onClick={closeModal}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Info */}
      <div className="wallet-info-section">
        <h2>Wallet Information</h2>
        <div className="info-cards">
          <div className="info-card-small">
            <div className="info-card-label">Transparent Balance</div>
            <div className="info-card-value">{balance.transparent} SHOL</div>
            <div className="info-card-note">Visible on-chain</div>
          </div>
          <div className="info-card-small">
            <div className="info-card-label">Shielded Balance</div>
            <div className="info-card-value">{balance.shielded} SHOL</div>
            <div className="info-card-note">Private, requires viewing key</div>
          </div>
          <div className="info-card-small">
            <div className="info-card-label">Total Balance</div>
            <div className="info-card-value">{balance.transparent + balance.shielded} SHOL</div>
            <div className="info-card-note">Combined holdings</div>
          </div>
        </div>
      </div>
    </div>
  );
}
