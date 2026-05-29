import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

export default function Multiplayer({ player, onClose }) {
  const [playersOnline, setPlayersOnline] = useState({});
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.emit('join', {
      name: 'Survivor',
      level: player?.level || 1,
      kills: player?.totalKills || 0
    });

    socket.on('playersOnline', setPlayersOnline);

    return () => socket.off('playersOnline');
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, sender: 'me' }]);
      setMessage('');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#1a1a0a', border: '3px solid #3a3a1a',
        padding: '25px', width: '700px', height: '500px', position: 'relative',
        display: 'flex', flexDirection: 'column'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', background: '#4a1a0a', color: '#ff4444', border: '2px solid #6a2a0a', padding: '8px 12px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>

        <div style={{ fontSize: '20px', fontWeight: '900', color: '#ffaa00', marginBottom: '15px', textAlign: 'center' }}>
          🌐 MULTIPLAYER
        </div>

        {/* PLAYERS ONLINE */}
        <div style={{ marginBottom: '15px' }}>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
            PLAYERS ONLINE: {Object.keys(playersOnline).length}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {Object.values(playersOnline).map(p => (
              <div key={p.id} style={{
                background: '#0a0a05', border: '1px solid #3a3a1a',
                padding: '8px 12px', borderRadius: '4px', fontSize: '10px', color: '#ffaa00'
              }}>
                {p.name} | LVL {p.level}
              </div>
            ))}
          </div>
        </div>

        {/* CHAT */}
        <div style={{ flex: 1, overflow: 'auto', background: '#0a0a05', border: '1px solid #3a3a1a', padding: '10px', marginBottom: '10px' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ color: m.sender === 'me' ? '#ffaa00' : '#888', fontSize: '11px', marginBottom: '4px' }}>
              {m.sender === 'me' ? 'You: ' : 'Stranger: '}{m.text}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <input value={message} onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type message..."
            style={{
              flex: 1, padding: '8px', background: '#0a0a05', border: '1px solid #3a3a1a',
              color: '#ffaa00', fontFamily: 'monospace', fontSize: '11px'
            }}
          />
          <button onClick={sendMessage} style={{
            padding: '8px 20px', background: '#ffaa00', color: '#000', border: 'none',
            fontWeight: 'bold', cursor: 'pointer', fontSize: '11px'
          }}>SEND</button>
        </div>
      </div>
    </div>
  );
}