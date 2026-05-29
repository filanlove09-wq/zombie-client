import React, { useState } from 'react';
import caseDragonImg from '../assets/case_dragon.png';
import pistolDragonImg from '../assets/pistol_dragon.png';
import shotgunDragonImg from '../assets/shotgun_dragon.png';
import knifeDragonImg from '../assets/knife_dragon.png';
import fistsDragonImg from '../assets/fists_dragon.png';

export default function CaseSystem({ player, onAction, onClose }) {
  const [isOpening, setIsOpening] = useState(false);
  const [reward, setReward] = useState(null);

  const items = [
    { name: 'DRAGON PISTOL', img: pistolDragonImg, weapon: 'pistol', rarity: 'RARE', color: '#3b82f6', chance: 0.30 },
    { name: 'DRAGON SHOTGUN', img: shotgunDragonImg, weapon: 'shotgun', rarity: 'EPIC', color: '#7c3aed', chance: 0.20 },
    { name: 'DRAGON KNIFE', img: knifeDragonImg, weapon: 'knife', rarity: 'LEGENDARY', color: '#fbbf24', chance: 0.10 },
    { name: 'DRAGON FISTS', img: fistsDragonImg, weapon: 'fists', rarity: 'COMMON', color: '#888', chance: 0.40 },
  ];

  const openCase = () => {
    if (isOpening) return;
    if ((player?.coins || 0) < 100) return;
    
    setIsOpening(true);
    onAction('openCase', { case: 'dragon' });
    
    setTimeout(() => {
      const rand = Math.random();
      let cumulative = 0;
      let selected = items[items.length - 1];
      
      for (let i = 0; i < items.length; i++) {
        cumulative += items[i].chance;
        if (rand < cumulative) {
          selected = items[i];
          break;
        }
      }
      
      setReward(selected);
      onAction('equipSkin', { weapon: selected.weapon, skin: 'dragon' });
    }, 2000);
  };

  const handleClose = () => {
    setIsOpening(false);
    setReward(null);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#111', border: '2px solid #fbbf24', borderRadius: '20px',
        padding: '30px', width: '500px', textAlign: 'center'
      }}>
        <button onClick={handleClose} style={{
          position: 'absolute', top: '15px', right: '15px',
          background: '#ff4b2b', color: '#fff', border: 'none',
          padding: '8px 12px', borderRadius: '8px', cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          ✕
        </button>

        <div style={{ fontSize: '20px', fontWeight: '900', color: '#fbbf24', marginBottom: '20px', letterSpacing: '2px' }}>
          🐉 DRAGON CASE
        </div>

        {!isOpening && !reward && (
          <>
            <img src={caseDragonImg} alt="Dragon Case" style={{ width: '200px', height: '200px', objectFit: 'contain', marginBottom: '20px' }} />
            <div style={{ marginBottom: '15px', color: '#666', fontSize: '12px' }}>
              Contains: Dragon Skins for all weapons
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '20px' }}>
              {items.map(item => (
                <div key={item.weapon} style={{ padding: '8px', background: '#0a0a0a', borderRadius: '8px', fontSize: '10px', color: item.color }}>
                  {item.rarity}: {item.name}
                </div>
              ))}
            </div>
            <button onClick={openCase} style={{
              width: '100%', padding: '15px', background: '#fbbf24', color: '#000',
              border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer',
              fontSize: '16px', letterSpacing: '2px'
            }}>
              OPEN CASE (100 COINS)
            </button>
          </>
        )}

        {isOpening && !reward && (
          <div style={{ padding: '40px' }}>
            <div style={{ fontSize: '60px', animation: 'spin 0.5s infinite' }}>🎁</div>
            <div style={{ marginTop: '20px', color: '#fbbf24', fontWeight: 'bold' }}>OPENING...</div>
          </div>
        )}

        {reward && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎉</div>
            <img src={reward.img} alt={reward.name} style={{ width: '180px', height: '180px', objectFit: 'contain', marginBottom: '15px' }} />
            <div style={{ color: reward.color, fontWeight: '900', fontSize: '18px', marginBottom: '5px' }}>{reward.rarity}</div>
            <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '16px', marginBottom: '20px' }}>{reward.name}</div>
            <button onClick={handleClose} style={{
              width: '100%', padding: '12px', background: '#00ff88', color: '#000',
              border: 'none', borderRadius: '10px', fontWeight: '900', cursor: 'pointer'
            }}>
              EQUIP & CLOSE
            </button>
          </>
        )}
      </div>
    </div>
  );
}