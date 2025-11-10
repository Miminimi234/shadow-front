import { useState, useEffect } from 'react';
import { wsPath } from '../config';

const EVENTS_ENDPOINT = wsPath('/events');

export interface NetworkEvent {
  type: string;
  slot?: number;
  hash?: string;
  leader?: string;
  transactions?: number;
  shielded_txs?: number;
  finalized?: boolean;
}

export function useWebSocket() {
  const [events, setEvents] = useState<NetworkEvent[]>([]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.debug('[ShadowChain] WS endpoint:', EVENTS_ENDPOINT);
    }

    // For now, use polling instead of WebSocket
    // Real WebSocket implementation commented out for simplicity
    /*
    const ws = new WebSocket(EVENTS_ENDPOINT);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setEvents(prev => [data, ...prev].slice(0, 100));
    };

    return () => ws.close();
    */

    // Mock events for now
    const interval = setInterval(() => {
      setEvents(prev => {
        const nextEvent: NetworkEvent = {
          type: 'slot',
          slot: Date.now(),
          hash: Math.random().toString(16).slice(2, 10),
          leader: `Validator-${Math.floor(Math.random() * 21)
            .toString()
            .padStart(2, '0')}`,
          transactions: Math.floor(Math.random() * 5000) + 500,
          shielded_txs: Math.floor(Math.random() * 600),
          finalized: Math.random() > 0.3,
        };
        return [nextEvent, ...prev].slice(0, 100);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return events;
}
