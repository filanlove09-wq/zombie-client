    import React, { useState } from 'react';
import petLvl1 from '../assets/pet_level1.png';
import petLvl2 from '../assets/pet_level2.png';
import petLvl3 from '../assets/pet_level3.png';

export default function PetSystem({ player, onAction, onClose }) {
  const pet = player?.pet || { level: 0, xp: 0, food: 100 };
  const hasPet = pet.level > 0;

  const petData = {
    0: { name: 'NONE', img: null, damage: 0, findChance: 0, special: '', cost: 100 },
    1: { name: 'PUPPY', img: petLvl1, damage: 3, findChance: 0.10, special: 'Finds food', cost: 0 },
    2: { name: 'GUARDIAN', img: petLvl2, damage: 8, findChance: 0.20, special: 'Finds scrap', cost: 300 },
    3: { name: 'CYBER-WOLF', img: petLvl3, damage: 15, findChance: 0.30, special: 'Calls allies', cost: 800 },
  };

  const currentPet = petData[pet.level];
  const nextPet = pet.level < 3 ? petData[pet.level + 1] : null;

  const buyPet = (level) => {
    const cost = petData[level].cost;
    if ((player?.coins || 0) >= cost) {
      onAction('buyPet', { level });
    }
  };

  const feedPet = () => {
    if ((player?.inventory?.cannedFood || 0) >= 1 && pet.food < 100) {
      onAction('feedPet');
    }
  };

  const upgradePet = () => {
    if (nextPet && (player?.coins || 0) >= nextPet.cost) {
      onAction('upgradePet');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#1a1a0a', border: '3px solid #3a3a1a',
        padding: '25px', width: '500px', position: 'relative'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '10px', right: '10px',
          background: '#4a1a0a', color: '#ff4444', border: '2px solid #6a2a0a',
          padding: '8px 12px', cursor: 'pointer', fontWeight: 'bold'
        }}>✕ CLOSE</button>

        <div style={{ fontSize: '18px', fontWeight: '900', color: '#ffaa00', marginBottom: '20px', letterSpacing: '2px', textAlign: 'center' }}>
          🐺 COMPANION
        </div>

        {!hasPet ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '60px', marginBottom: '15px' }}>🐾</div>
            <div style={{ color: '#888', marginBottom: '15px', fontSize: '11px' }}>
              A loyal companion helps in battle and finds loot
            </div>
            <button onClick={() => buyPet(1)} disabled={(player?.coins || 0) < 100} style={{
              padding: '12px 30px', background: (player?.coins || 0) >= 100 ? '#ffaa00' : '#1a1a0a',
              color: (player?.coins || 0) >= 100 ? '#000' : '#666', border: '2px solid #3a3a1a',
              fontWeight: '900', cursor: (player?.coins || 0) >= 100 ? 'pointer' : 'not-allowed', fontSize: '13px'
            }}>
              ADOPT PUPPY (100 COINS)
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <img src={currentPet.img} alt={currentPet.name} style={{ width: '150px', height: '150px', objectFit: 'contain', marginBottom: '10px' }} />
            <div style={{ fontSize: '16px', fontWeight: '900', color: '#ffaa00', marginBottom: '5px' }}>{currentPet.name}</div>
            <div style={{ fontSize: '10px', color: '#888', marginBottom: '15px' }}>{currentPet.special}</div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#888', marginBottom: '3px' }}>
                <span>FOOD</span>
                <span>{Math.floor(pet.food)}/100</span>
              </div>
              <div style={{ width: '100%', height: '5px', background: '#0a0a05', border: '1px solid #3a3a1a' }}>
                <div style={{ height: '100%', background: '#ffaa00', width: `${pet.food}%` }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '15px' }}>
              <div style={{ background: '#0a0a05', padding: '8px', border: '1px solid #3a3a1a' }}>
                <div style={{ fontSize: '14px' }}>⚔️</div>
                <div style={{ fontSize: '9px', color: '#ff4444', fontWeight: 'bold' }}>{currentPet.damage} DMG</div>
              </div>
              <div style={{ background: '#0a0a05', padding: '8px', border: '1px solid #3a3a1a' }}>
                <div style={{ fontSize: '14px' }}>🔍</div>
                <div style={{ fontSize: '9px', color: '#ffaa00', fontWeight: 'bold' }}>+{Math.floor(currentPet.findChance * 100)}% FIND</div>
              </div>
              <div style={{ background: '#0a0a05', padding: '8px', border: '1px solid #3a3a1a' }}>
                <div style={{ fontSize: '14px' }}>⭐</div>
                <div style={{ fontSize: '9px', color: '#888', fontWeight: 'bold' }}>LVL {pet.level}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={feedPet} disabled={(player?.inventory?.cannedFood || 0) < 1 || pet.food >= 100} style={{
                padding: '8px 15px', background: '#ffaa00', color: '#000', border: '2px solid #3a3a1a',
                fontWeight: 'bold', cursor: 'pointer', fontSize: '10px', opacity: (player?.inventory?.cannedFood || 0) < 1 ? 0.5 : 1
              }}>
                🍱 FEED
              </button>

              {nextPet && (
                <button onClick={upgradePet} disabled={(player?.coins || 0) < nextPet.cost} style={{
                  padding: '8px 15px', background: (player?.coins || 0) >= nextPet.cost ? '#ff6600' : '#1a1a0a',
                  color: (player?.coins || 0) >= nextPet.cost ? '#000' : '#666', border: '2px solid #3a3a1a',
                  fontWeight: 'bold', cursor: (player?.coins || 0) >= nextPet.cost ? 'pointer' : 'not-allowed', fontSize: '10px'
                }}>
                  ⬆ UPGRADE ({nextPet.cost}💰)
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}