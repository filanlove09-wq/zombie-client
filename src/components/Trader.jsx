import React from 'react';

export default function Trader({ player, onAction, onClose }) {
  const [selectedTab, setSelectedTab] = React.useState('buy');

  const itemsForSale = [
    { id: 'medkit_pack', name: 'MEDKIT PACK', icon: '💉', description: '3 medkits', price: 80 },
    { id: 'food_pack', name: 'FOOD CRATE', icon: '🍱', description: '5 canned food', price: 50 },
    { id: 'water_pack', name: 'WATER BOTTLES', icon: '🥤', description: '5 bottles', price: 40 },
    { id: 'scrap_pack', name: 'SCRAP PARTS', icon: '🔧', description: '20 scrap', price: 30 },
    { id: 'xp_boost', name: 'XP SCROLL', icon: '📜', description: '+100 XP', price: 200 },
  ];

  const sellItems = [
    { id: 'sell_scrap', name: 'SELL SCRAP', icon: '🔧', description: '5 scrap = 8 coins', price: 8 },
    { id: 'sell_food', name: 'SELL FOOD', icon: '🍱', description: '1 can = 5 coins', price: 5 },
    { id: 'sell_water', name: 'SELL WATER', icon: '🥤', description: '1 bottle = 4 coins', price: 4 },
    { id: 'sell_medkit', name: 'SELL MEDKIT', icon: '💉', description: '1 medkit = 15 coins', price: 15 },
  ];

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#1a1a0a', border: '3px solid #3a3a1a',
        borderRadius: '4px', padding: '25px', width: '500px', maxHeight: '80vh', overflow: 'auto',
        boxShadow: '0 0 50px rgba(255,170,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #3a3a1a', paddingBottom: '15px' }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '900', color: '#ffaa00', letterSpacing: '2px' }}>🛒 TRADER</div>
            <div style={{ fontSize: '8px', color: '#888', marginTop: '4px' }}>Wasteland Wanderer</div>
          </div>
          <button onClick={onClose} style={{
            background: '#4a1a0a', color: '#ff4444', border: '2px solid #6a2a0a',
            padding: '8px 12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px'
          }}>✕ CLOSE</button>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <button onClick={() => setSelectedTab('buy')} style={{
            flex: 1, padding: '10px',
            background: selectedTab === 'buy' ? '#ffaa00' : '#1a1a0a',
            color: selectedTab === 'buy' ? '#000' : '#888',
            border: '2px solid #3a3a1a', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', letterSpacing: '1px'
          }}>🛍️ BUY</button>
          <button onClick={() => setSelectedTab('sell')} style={{
            flex: 1, padding: '10px',
            background: selectedTab === 'sell' ? '#ffaa00' : '#1a1a0a',
            color: selectedTab === 'sell' ? '#000' : '#888',
            border: '2px solid #3a3a1a', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', letterSpacing: '1px'
          }}>💰 SELL</button>
        </div>

        <div style={{ marginBottom: '15px', textAlign: 'center', color: '#ffaa00', fontWeight: 'bold', fontSize: '14px', background: '#0a0a05', padding: '8px', border: '1px solid #3a3a1a' }}>
          COINS: {player?.coins || 0}
        </div>

        {selectedTab === 'buy' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {itemsForSale.map(item => (
              <div key={item.id} style={{
                background: '#0a0a05', border: '1px solid #3a3a1a',
                padding: '10px', display: 'flex', alignItems: 'center', gap: '10px'
              }}>
                <span style={{ fontSize: '24px' }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#ffaa00' }}>{item.name}</div>
                  <div style={{ fontSize: '8px', color: '#888' }}>{item.description}</div>
                </div>
                <button onClick={() => onAction('traderBuy', { item: item.id })} disabled={(player?.coins || 0) < item.price} style={{
                  padding: '6px 12px',
                  background: (player?.coins || 0) >= item.price ? '#ffaa00' : '#1a1a0a',
                  color: (player?.coins || 0) >= item.price ? '#000' : '#666',
                  border: '1px solid #3a3a1a', cursor: (player?.coins || 0) >= item.price ? 'pointer' : 'not-allowed',
                  fontWeight: 'bold', fontSize: '10px'
                }}>{item.price} COINS</button>
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'sell' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sellItems.map(item => (
              <div key={item.id} style={{
                background: '#0a0a05', border: '1px solid #3a3a1a',
                padding: '10px', display: 'flex', alignItems: 'center', gap: '10px'
              }}>
                <span style={{ fontSize: '24px' }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#ffaa00' }}>{item.name}</div>
                  <div style={{ fontSize: '8px', color: '#888' }}>{item.description}</div>
                </div>
                <button onClick={() => onAction('traderSell', { item: item.id })} style={{
                  padding: '6px 12px', background: '#ffaa00', color: '#000',
                  border: '1px solid #3a3a1a', cursor: 'pointer', fontWeight: 'bold', fontSize: '10px'
                }}>+{item.price} COINS</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}