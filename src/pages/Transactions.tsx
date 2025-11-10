import React, { useState } from 'react';

type TxType = 'transparent' | 'shield' | 'unshield' | 'shielded';

export default function Transactions() {
  const [txType, setTxType] = useState<TxType>('transparent');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const [transparentForm, setTransparentForm] = useState({
    from: '',
    to: '',
    amount: '',
    fee: '0.001',
  });

  const [shieldForm, setShieldForm] = useState({
    from: '',
    amount: '',
    fee: '0.002',
  });

  const [unshieldForm, setUnshieldForm] = useState({
    note: '',
    to: '',
    amount: '',
    fee: '0.002',
  });

  const [shieldedForm, setShieldedForm] = useState({
    from: '',
    to: '',
    amount: '',
    fee: '0.003',
  });

  const submitTransaction = async () => {
    setLoading(true);
    setResult('');

    try {
      // Simulate submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      setResult(`Transaction submitted successfully (${txType})`);
    } catch (err) {
      setResult('Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Submit Transaction</h1>
        <p>All four transaction types supported</p>
      </div>

      {/* Transaction Type Selector */}
      <div className="tx-type-selector">
        <button
          className={`tx-type-btn ${txType === 'transparent' ? 'active' : ''}`}
          onClick={() => setTxType('transparent')}
        >
          <span className="tx-type-icon transparent">t→t</span>
          <span>Transparent</span>
        </button>
        <button
          className={`tx-type-btn ${txType === 'shield' ? 'active' : ''}`}
          onClick={() => setTxType('shield')}
        >
          <span className="tx-type-icon shield">t→z</span>
          <span>Shield</span>
        </button>
        <button
          className={`tx-type-btn ${txType === 'unshield' ? 'active' : ''}`}
          onClick={() => setTxType('unshield')}
        >
          <span className="tx-type-icon unshield">z→t</span>
          <span>Unshield</span>
        </button>
        <button
          className={`tx-type-btn ${txType === 'shielded' ? 'active' : ''}`}
          onClick={() => setTxType('shielded')}
        >
          <span className="tx-type-icon shielded">z→z</span>
          <span>Private</span>
        </button>
      </div>

      {/* Transaction Forms */}
      <div className="tx-form-container">
        {txType === 'transparent' && (
          <div className="tx-form">
            <h3>Transparent Transfer (Public)</h3>
            <div className="form-field">
              <label>From Address</label>
              <input
                type="text"
                placeholder="sol1..."
                value={transparentForm.from}
                onChange={(e) => setTransparentForm({...transparentForm, from: e.target.value})}
              />
            </div>
            <div className="form-field">
              <label>To Address</label>
              <input
                type="text"
                placeholder="sol1..."
                value={transparentForm.to}
                onChange={(e) => setTransparentForm({...transparentForm, to: e.target.value})}
              />
            </div>
            <div className="form-field">
              <label>Amount (SHOL)</label>
              <input
                type="number"
                placeholder="0.00"
                value={transparentForm.amount}
                onChange={(e) => setTransparentForm({...transparentForm, amount: e.target.value})}
              />
            </div>
            <div className="form-note">
              This transaction will be visible on-chain
            </div>
          </div>
        )}

        {txType === 'shield' && (
          <div className="tx-form">
            <h3>Shield to Privacy Pool (t→z)</h3>
            <div className="form-field">
              <label>From Transparent Address</label>
              <input
                type="text"
                placeholder="sol1..."
                value={shieldForm.from}
                onChange={(e) => setShieldForm({...shieldForm, from: e.target.value})}
              />
            </div>
            <div className="form-field">
              <label>Amount to Shield (SHOL)</label>
              <input
                type="number"
                placeholder="0.00"
                value={shieldForm.amount}
                onChange={(e) => setShieldForm({...shieldForm, amount: e.target.value})}
              />
            </div>
            <div className="form-note privacy">
              This will create a shielded note commitment. Amount will be hidden.
            </div>
          </div>
        )}

        {txType === 'unshield' && (
          <div className="tx-form">
            <h3>Unshield to Transparent (z→t)</h3>
            <div className="form-field">
              <label>Note Commitment</label>
              <input
                type="text"
                placeholder="0x..."
                value={unshieldForm.note}
                onChange={(e) => setUnshieldForm({...unshieldForm, note: e.target.value})}
              />
            </div>
            <div className="form-field">
              <label>To Transparent Address</label>
              <input
                type="text"
                placeholder="sol1..."
                value={unshieldForm.to}
                onChange={(e) => setUnshieldForm({...unshieldForm, to: e.target.value})}
              />
            </div>
            <div className="form-field">
              <label>Amount (SHOL)</label>
              <input
                type="number"
                placeholder="0.00"
                value={unshieldForm.amount}
                onChange={(e) => setUnshieldForm({...unshieldForm, amount: e.target.value})}
              />
            </div>
            <div className="form-note">
              Requires spend proof generation (~4s)
            </div>
          </div>
        )}

        {txType === 'shielded' && (
          <div className="tx-form">
            <h3>Private Transfer (z→z)</h3>
            <div className="form-field">
              <label>From Shielded Address</label>
              <input
                type="text"
                placeholder="shadow1..."
                value={shieldedForm.from}
                onChange={(e) => setShieldedForm({...shieldedForm, from: e.target.value})}
              />
            </div>
            <div className="form-field">
              <label>To Shielded Address</label>
              <input
                type="text"
                placeholder="shadow1..."
                value={shieldedForm.to}
                onChange={(e) => setShieldedForm({...shieldedForm, to: e.target.value})}
              />
            </div>
            <div className="form-field">
              <label>Amount (SHOL)</label>
              <input
                type="number"
                placeholder="0.00"
                value={shieldedForm.amount}
                onChange={(e) => setShieldedForm({...shieldedForm, amount: e.target.value})}
              />
            </div>
            <div className="form-note privacy">
              Fully private. No one can see sender, recipient, or amount.
              Requires spend + output proof (~6-8s)
            </div>
          </div>
        )}

        <button
          className="submit-tx-btn"
          onClick={submitTransaction}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Submit Transaction'}
        </button>

        {result && (
          <div className={`tx-result ${result.includes('success') ? 'success' : 'error'}`}>
            {result}
          </div>
        )}
      </div>

      {/* Transaction History Note */}
      <div className="tx-note-section">
        <p>Transaction history and statistics available in Dashboard</p>
      </div>
    </div>
  );
}

