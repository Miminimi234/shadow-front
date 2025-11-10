export interface ChainInfo {
  chain: string;
  token: string;
  version: string;
  tagline: string;
  stats: {
    height: number;
    total_transactions: number;
    total_commitments: number;
    total_nullifiers: number;
    total_volume: number;
    merkle_root?: string;
  };
  privacy?: {
    shielded_transactions: number;
    transparent_transactions: number;
    shielded_ratio: number;
    shield_operations?: number;
    unshield_operations?: number;
    private_transfers?: number;
    anonymity_set_size: number;
    shielded_pool_value: number;
    privacy_score: number;
    active_commitments?: number;
    active_notes?: number;
    spent_notes: number;
    merkle_tree_depth: number;
    merkle_tree_size?: number;
    nullifier_entropy: number;
  };
  sapling?: {
    spend_proofs: number;
    output_proofs: number;
    total_proofs: number;
    proof_success_rate: number;
    avg_spend_proof_time: number;
    avg_output_proof_time: number;
    avg_verification_time: number;
    circuit_constraints: number;
    circuit_utilization: number;
  };
  poh?: {
    current_slot: number;
    current_hash: string;
    tick_count: number;
    hashes_per_slot: number;
    hash_rate: number;
    leader: string;
    leader_pubkey: string;
  };
  consensus?: {
    type: string;
    total_stake: number;
    active_validators: number;
    supermajority: number;
    finality_slots: number;
  };
  zkp?: {
    total_proofs_generated: number;
    proof_success_rate: number;
    avg_proof_generation_time: number;
    avg_verification_time: number;
    circuit_constraints: number;
    circuit_utilization: number;
    proof_size_bytes: number;
    groth16_curve: string;
  };
  features: string[];
}

export interface ExplorerTx {
  signature: string;
  timestamp: number;
  version: number;
  inputs: number;
  outputs: number;
  fee: number;
  has_zkp: boolean;
}

export interface SubmitTxResponse {
  signature: string;
  status: string;
  version: number;
  zkp_verified: boolean;
}

export interface MerkleRootResponse {
  root: string;
  height: number;
}
