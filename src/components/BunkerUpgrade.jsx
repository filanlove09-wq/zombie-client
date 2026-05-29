import React from 'react';

export default function BunkerUpgrade({ player, onAction }) {
  const bunker = player?.bunker || { level: 1, foodGen: 0, waterGen: 0, medBay: 0, storage: 0 };
  
  const upgrades = [
    { id: 'foodGen', name: 'FOOD GENERATOR', icon: '🍱', levels: [
      { cost: 50, desc: '0.5 food/15sec' }, { cost: 100, desc: '1 food/15sec' }, { cost: 200, desc: '2 food/15sec' }
    ]},
    { id: 'waterGen', name: 'WATER PURIFIER', icon: '🥤', levels: [
      { cost: 50, desc: '0.5 water/15sec' }, { cost: 100, desc: '1 water/15sec' }, { cost: 200, desc: '2 water/15sec' }
    ]},
    { id: 'medBay', name: 'MED BAY', icon: '💉', levels: [
      { cost: 75, desc: '0.5 HP/sec' }, { cost: 150, desc: '1 HP/sec' }, { cost: 300, desc: '2 HP/sec' }
    ]},
    { id: 'storage', name: 'STORAGE', icon: '📦', levels: [
      { cost: 60, desc: 'Max +5' }, { cost: 120, desc: 'Max +10' }, { cost: 250, desc: 'Max +15' }
    ]}
  ];

  const bunkerLevel = bunker.level || 1;
  const upgradeCost = bunkerLevel * 100;

  return (
    <div style={{ background: '#1a1a0a', border: '2px solid #3a3a1a', borderRadius: '4px', padding: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center', borderBottom: '1px solid #3a3a1a', paddingBottom: '10px' }}>
        <span style={{ fontSize: '10px', fontWeight: '900', color: '#888', letterSpacing: '2px' }}>BUNKER LVL {bunkerLevel}</span>
        {bunkerLevel < 5 ? (
          <button onClick={() => onAction('upgradeBunker')} disabled={(player?.coins || 0) < upgradeCost}
            style={{ padding: '4px 8px', background: (player?.coins || 0) >= upgradeCost ? '#ffaa00' : '#1a1a0a', color: (player?.coins || 0) >= upgradeCost ? '#000' : '#666', border: '1px solid #3a3a1a', fontSize: '8px', fontWeight: 'bold', cursor: (player?.coins || 0) >= upgradeCost ? 'pointer' : 'not-allowed' }}>
            UPGRADE ({upgradeCost}💰)
          </button>
        ) : (
          <span style={{ fontSize: '8px', color: '#ffaa00', fontWeight: 'bold' }}>MAX</span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {upgrades.map(up => {
          const lvl = bunker[up.id] || 0;
          const next = lvl < 3 ? up.levels[lvl] : null;
          const curr = lvl > 0 ? up.levels[lvl - 1] : null;

          return (
            <div key={up.id} style={{ background: '#0a0a05', border: '1px solid #3a3a1a', padding: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>{up.icon}</span>
                  <div>
                    <div style={{ fontSize: '9px', fontWeight: 'bold', color: '#ffaa00' }}>{up.name}</div>
                    <div style={{ fontSize: '7px', color: '#888' }}>Lvl {lvl}/3</div>
                  </div>
                </div>
                {next ? (
                  <button onClick={() => onAction('upgradeBunkerModule', { module: up.id })} disabled={(player?.coins || 0) < next.cost}
                    style={{ padding: '4px 8px', background: (player?.coins || 0) >= next.cost ? '#ffaa00' : '#1a1a0a', color: (player?.coins || 0) >= next.cost ? '#000' : '#666', border: '1px solid #3a3a1a', fontSize: '7px', fontWeight: 'bold', cursor: (player?.coins || 0) >= next.cost ? 'pointer' : 'not-allowed' }}>
                    UPGRADE ({next.cost}💰)
                  </button>
                ) : (
                  <span style={{ fontSize: '7px', color: '#ffaa00' }}>MAX</span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '3px', marginBottom: '4px' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ flex: 1, height: '3px', background: i < lvl ? '#ffaa00' : '#0a0a05', border: '1px solid #3a3a1a' }} />
                ))}
              </div>
              <div style={{ fontSize: '7px', color: '#888' }}>{curr ? curr.desc : 'Not installed'}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}