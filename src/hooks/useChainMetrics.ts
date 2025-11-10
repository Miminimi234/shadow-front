import { useState, useEffect } from 'react';
import { apiPath } from '../config';

const METRICS_ENDPOINT = apiPath('/shadow/info');

export interface ChainMetrics {
  slot: number;
  epoch: number;
  tps: number;
  total_transactions: number;
  transparent_txs: number;
  shielded_txs: number;
  shield_ops: number;
  unshield_ops: number;
  private_transfers: number;
  shielded_pool_size: number;
  nullifier_count: number;
  total_stake: number;
  active_validators: number;
}

export function useChainMetrics() {
  const [metrics, setMetrics] = useState<ChainMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(METRICS_ENDPOINT);
        if (!response.ok) {
          throw new Error(`ShadowChain API responded with ${response.status}`);
        }
        const data = await response.json();
        
        // Map API response to metrics
        const mappedMetrics: ChainMetrics = {
          slot: data.stats?.height || 0,
          epoch: data.stats?.epoch || 0,
          tps: data.stats?.current_tps || 0,
          total_transactions: data.stats?.total_transactions || 0,
          transparent_txs: data.privacy?.transparent_transactions || 0,
          shielded_txs: data.privacy?.shielded_transactions || 0,
          shield_ops: data.privacy?.shield_operations || 0,
          unshield_ops: data.privacy?.unshield_operations || 0,
          private_transfers: data.privacy?.private_transfers || 0,
          shielded_pool_size: data.privacy?.merkle_tree_size || 0,
          nullifier_count: data.privacy?.spent_notes || 0,
          total_stake: data.consensus?.total_stake || 0,
          active_validators: data.consensus?.active_validators || 0,
        };
        
        setMetrics(mappedMetrics);
      } catch (err) {
        console.error('Failed to fetch metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 2000); // Update every 2s

    return () => clearInterval(interval);
  }, []);

  return { metrics, loading };
}
