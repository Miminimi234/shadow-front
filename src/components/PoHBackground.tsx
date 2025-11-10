import { useEffect, useState } from 'react';

interface PoHProps {
    intervalMs?: number;
    maxLines?: number;
    opacity?: number; // applied to container via style
}

export default function PoHBackground({ intervalMs = 400, maxLines = 20, opacity = 0.18 }: PoHProps) {
    const [hashes, setHashes] = useState<string[]>([]);

    useEffect(() => {
        const generateHash = () => {
            return Array.from({ length: 16 }, () =>
                Math.floor(Math.random() * 16).toString(16)
            ).join('');
        };

        const timer = setInterval(() => {
            setHashes(prev => [generateHash(), ...prev.slice(0, Math.max(0, maxLines - 1))]);
        }, intervalMs);

        return () => clearInterval(timer);
    }, [intervalMs, maxLines]);

    return (
        <div className="poh-background" style={{ opacity }}>
            {hashes.map((hash, i) => (
                <div
                    key={i}
                    className="hash-line"
                    style={{ opacity: 1 - (i * 0.05) }}
                >
                    {hash}
                </div>
            ))}
        </div>
    );
}
