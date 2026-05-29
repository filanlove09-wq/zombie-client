import React, { useState } from 'react';

export default function Achievements({ player }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const achievements = [
    { id: 'firstKill', name: 'FIRST BLOOD', description: 'Kill your first zombie', icon: '💀', reward: '100 coins', check: (p) => (p.totalKills || 0) >= 1 },
    { id: 'hunter', name: 'HUNTER', description: 'Kill 10 zombies', icon: '🎯', reward: '500 coins', check: (p) => (p.totalKills || 0) >= 10 },
    { id: 'slayer', name: 'SLAYER', description: 'Kill 50 zombies', icon: '⚔️', reward: '2000 coins', check: (p) => (p.totalKills || 0) >= 50 },
    { id: 'millionaire', name: 'WASTELAND RICH', description: 'Collect 1000 coins', icon: '💰', reward: '500 XP', check: (p) => (p.coins || 0) >= 1000 },
    { id: 'veteran', name: 'VETERAN', description: 'Reach level 10', icon: '⭐', reward: '3000 coins', check: (p) => (p.level || 1) >= 10 }
  ];

  const earned = achievements.filter(a => player?.achievements?.[a.id]);
  const available = achievements.filter(a => !player?.achievements?.[a.id] && a.check(player));
  const locked = achievements.filter(a => !player?.achievements?.[a.id] && !a.check(player));

  return (
    <div style={{ background: '#1a1a0a', border: '2px solid #3a3a1a', borderRadius: '4px', padding: '12px' }}>
      <div onClick={() => setIsOpen(!isOpen)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: isOpen ? '1px solid #3a3a1a' : 'none', paddingBottom: isOpen ? '10px' : '0' }}>
        <span style={{ fontSize: '10px', fontWeight: '900', color: '#888', letterSpacing: '2px' }}>ACHIEVEMENTS ({earned.length}/{achievements.length})</span>
        <span style={{ fontSize: '12px', color: '#888' }}>{isOpen ? '▼' : '▶'}</span>
      </div>

      {!isOpen && (
        <div style={{ width: '100%', height: '3px', background: '#0a0a05', marginTop: '8px', border: '1px solid #3a3a1a' }}>
          <div style={{ height: '100%', background: '#ffaa00', width: `${(earned.length / achievements.length) * 100}%` }} />
        </div>
      )}

      {isOpen && (
        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {available.map(a => (
            <div key={a.id} style={{ background: 'rgba(255,170,0,0.05)', padding: '8px', border: '1px solid #3a3a1a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{a.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '9px', color: '#ffaa00', fontWeight: 'bold' }}>{a.name}</div>
                <div style={{ fontSize: '7px', color: '#888' }}>{a.description}</div>
              </div>
              <span style={{ fontSize: '7px', color: '#ffaa00' }}>{a.reward}</span>
            </div>
          ))}
          {earned.map(a => (
            <div key={a.id} style={{ background: 'rgba(255,170,0,0.1)', padding: '8px', border: '1px solid #ffaa00', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.8 }}>
              <span>{a.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '9px', color: '#ffaa00', fontWeight: 'bold' }}>{a.name}</div>
                <div style={{ fontSize: '7px', color: '#888' }}>{a.description}</div>
              </div>
              <span>✅</span>
            </div>
          ))}
          {locked.map(a => (
            <div key={a.id} style={{ background: '#0a0a05', padding: '8px', border: '1px solid #222', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.4 }}>
              <span>🔒</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '9px', color: '#666' }}>???</div>
                <div style={{ fontSize: '7px', color: '#555' }}>Hidden</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}