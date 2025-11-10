// Simplified crypto WITHOUT WASM (for demo)
// This simulates the cryptography - in production, use shadowchain-wasm

export class ShadowKeypair {
  public address: string;
  public secretKey: string;
  public publicKey: string;

  constructor() {
    // Generate random keys (simplified)
    this.secretKey = this.randomHex(32);
    this.publicKey = this.randomHex(32);
    this.address = 'shadow1' + this.randomHex(10);
  }

  private randomHex(length: number): string {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  shield(amount: number) {
    const commitment = this.randomHex(32);
    const randomness = this.randomHex(32);
    
    return {
      commitment,
      owner: this.publicKey,
      address: this.address,
      amount: amount * 1_000_000_000,
    };
  }

  createNote(amount: number) {
    return this.shield(amount);
  }
}

export function lamportsToShol(lamports: number): number {
  return lamports / 1_000_000_000;
}

export function sholToLamports(shol: number): number {
  return Math.floor(shol * 1_000_000_000);
}
