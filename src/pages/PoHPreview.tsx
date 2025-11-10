import React from 'react';
import PoHBackground from '../components/PoHBackground';

export default function PoHPreview() {
    const [interval, setIntervalMs] = React.useState(400);
    const [lines, setLines] = React.useState(20);
    const [opacity, setOpacity] = React.useState(0.18);

    return (
        <div style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
            <PoHBackground intervalMs={interval} maxLines={lines} opacity={opacity} />

            <div style={{ position: 'relative', zIndex: 2, padding: '2rem', color: '#fff' }}>
                <h1 style={{ marginBottom: '0.5rem' }}>PoH Background Preview</h1>
                <p style={{ marginTop: 0 }}>Use the controls below to tune the background animation.</p>

                <div style={{ marginTop: '1.5rem', display: 'grid', gap: '0.5rem', maxWidth: 520 }}>
                    <label>
                        Interval (ms): {interval}
                        <input type="range" min={50} max={1000} value={interval} onChange={(e) => setIntervalMs(Number(e.target.value))} />
                    </label>

                    <label>
                        Lines: {lines}
                        <input type="range" min={2} max={80} value={lines} onChange={(e) => setLines(Number(e.target.value))} />
                    </label>

                    <label>
                        Opacity: {opacity.toFixed(2)}
                        <input type="range" min={0} max={1} step={0.01} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} />
                    </label>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <a href="/" style={{ color: '#00d4ff' }}>Return to app</a>
                        <a href="#/poh" style={{ color: '#00d4ff' }}>Hash preview route: #/poh</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
