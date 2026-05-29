import React from 'react';

export default function Inventory({ player, onAction }) {
  const consumables = [
    { id: 'cannedFood', icon: '🍱', label: 'FOOD' },
    { id: 'waterBottle', icon: '🥤', label: 'WATER' },
    { id: 'medkit', icon: '💉', label: 'MEDKIT' }
  ];

  return (
    <div style={{ 
      background: '#1a1a0a', border: '2px solid #3a3a1a', 
      borderRadius: '4px', padding: '12px'
    }}>
      <div style={{ 
        fontSize: '10px', fontWeight: '900', color: '#888', 
        marginBottom: '10px', letterSpacing: '2px',
        borderBottom: '1px solid #3a3a1a', paddingBottom: '8px'
      }}>
        INVENTORY
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {consumables.map(item => (
          <button 
            key={item.id} 
            onClick={() => onAction('use', { itemId: item.id })}
            style={{ 
              flex: 1, background: '#0a0a05', 
              border: '1px solid #3a3a1a', padding: '10px', 
              color: '#ccc', cursor: 'pointer', textAlign: 'center',
              borderRadius: '4px'
            }}
          >
            <div style={{ fontSize: '18px' }}>{item.icon}</div>
            <div style={{ fontSize: '9px', fontWeight: 'bold', color: '#ffaa00', marginTop: '3px' }}>
              {player?.inventory?.[item.id] || 0}
            </div>
            <div style={{ fontSize: '7px', color: '#888', marginTop: '2px' }}>{item.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}