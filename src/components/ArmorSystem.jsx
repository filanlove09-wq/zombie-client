import React from 'react';
import helmetImg from '../assets/helmet.png';
import chestplateImg from '../assets/chestplate.png';
import leggingsImg from '../assets/leggings.png';
import bootsImg from '../assets/boots.png';

export default function ArmorSystem({ player, onAction }) {
  const armor = player?.armor || {};
  const unlockedOrder = armor.unlockedOrder || 0;
  
  const armorPieces = [
    { id: 'helmet', name: 'HELMET', image: helmetImg, cost: 10, defense: 10, repairCost: 3, order: 1 },
    { id: 'chestplate', name: 'CHESTPLATE', image: chestplateImg, cost: 15, defense: 20, repairCost: 5, order: 2 },
    { id: 'leggings', name: 'LEGGINGS', image: leggingsImg, cost: 10, defense: 10, repairCost: 3, order: 3 },
    { id: 'boots', name: 'BOOTS', image: bootsImg, cost: 8, defense: 5, repairCost: 2, order: 4 }
  ];

  const activePieces = armorPieces.filter(p => armor[p.id]?.owned && armor[p.id]?.durability > 0);
  const totalDefense = activePieces.reduce((sum, p) => sum + p.defense, 0) + (activePieces.length === 4 ? 10 : 0);

  return (
    <div style={{ background: '#1a1a0a', border: '2px solid #3a3a1a', borderRadius: '4px', padding: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center', borderBottom: '1px solid #3a3a1a', paddingBottom: '10px' }}>
        <span style={{ fontSize: '10px', fontWeight: '900', color: '#888', letterSpacing: '2px' }}>ARMOR</span>
        <div style={{ display: 'flex', gap: '12px', fontSize: '9px' }}>
          <span style={{ color: '#ffaa00' }}>🛡️ {totalDefense}%</span>
          <span style={{ color: '#666' }}>{activePieces.length}/4</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
        {armorPieces.map((piece) => {
          const isUnlocked = piece.order <= unlockedOrder;
          const pieceData = armor[piece.id] || {};
          const isOwned = pieceData.owned;
          const durability = pieceData.durability || 0;
          const isEquipped = isOwned && durability > 0;
          const canUnlock = !isUnlocked && piece.order === unlockedOrder + 1;
          const hasEnoughScrap = (player?.scrap || 0) >= piece.cost;
          const canRepair = isOwned && durability < 100 && (player?.scrap || 0) >= piece.repairCost;

          return (
            <div key={piece.id} style={{
              background: isEquipped ? 'rgba(255,170,0,0.05)' : '#0a0a05',
              border: isEquipped ? '1px solid #ffaa00' : '1px solid #3a3a1a',
              padding: '8px', textAlign: 'center',
              opacity: isUnlocked || piece.order === unlockedOrder + 1 ? 1 : 0.3,
              boxSizing: 'border-box'
            }}>
              <div style={{ width: '100%', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                <img 
                  src={piece.image} 
                  alt={piece.name}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              
              <div style={{ fontSize: '7px', fontWeight: 'bold', color: isEquipped ? '#ffaa00' : '#888', marginBottom: '4px' }}>
                {piece.name}
              </div>
              
              {isOwned ? (
                <>
                  <div style={{ width: '100%', height: '2px', background: '#0a0a05', border: '1px solid #3a3a1a', marginBottom: '3px' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${durability}%`, 
                      background: durability > 50 ? '#ffaa00' : durability > 25 ? '#ff6600' : '#ff4444'
                    }} />
                  </div>
                  <div style={{ fontSize: '6px', color: '#888', marginBottom: '3px' }}>{Math.floor(durability)}%</div>
                  {canRepair ? (
                    <button onClick={() => onAction('repairArmor', { piece: piece.id })} 
                      style={{ padding: '3px 6px', background: '#ffaa00', color: '#000', border: '1px solid #3a3a1a', fontSize: '6px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>
                      🔧 {piece.repairCost}
                    </button>
                  ) : (
                    <button disabled 
                      style={{ padding: '3px 6px', background: '#1a1a0a', color: '#666', border: '1px solid #222', fontSize: '6px', fontWeight: 'bold', width: '100%', cursor: 'not-allowed' }}>
                      🔧 {piece.repairCost}
                    </button>
                  )}
                </>
              ) : canUnlock ? (
                hasEnoughScrap ? (
                  <button onClick={() => onAction('unlockArmor', { piece: piece.id })} 
                    style={{ padding: '4px 6px', background: '#ffaa00', color: '#000', border: '1px solid #3a3a1a', fontSize: '6px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>
                    🔓 {piece.cost}
                  </button>
                ) : (
                  <button disabled 
                    style={{ padding: '4px 6px', background: '#1a1a0a', color: '#666', border: '1px solid #222', fontSize: '6px', fontWeight: 'bold', width: '100%', cursor: 'not-allowed' }}>
                    🔓 {piece.cost}
                  </button>
                )
              ) : isUnlocked ? (
                <div style={{ fontSize: '6px', color: '#ffaa00' }}>✅ OWNED</div>
              ) : (
                <div style={{ fontSize: '6px', color: '#555' }}>🔒 LOCKED</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}