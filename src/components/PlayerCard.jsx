import React from 'react';
import playerDefault from '../assets/player_default.png';
import playerHelmet from '../assets/player_helmet.png';
import playerHelmetChest from '../assets/player_helmet_chest.png';
import playerHelmetChestLegs from '../assets/player_helmet_chest_legs.png';
import playerFullArmor from '../assets/player_full_armor.png';
import withpet1 from '../assets/withpet1.png';
import withpet2 from '../assets/withpet2.png';
import withpet3 from '../assets/withpet3.png';

export default function PlayerCard({ player }) {
  if (!player) return null;

  const maxResource = 10 + 
    (player?.bunker?.storage >= 1 ? 5 : 0) + 
    (player?.bunker?.storage >= 2 ? 5 : 0) + 
    (player?.bunker?.storage >= 3 ? 5 : 0);

  const getPlayerImage = () => {
    const petLevel = player?.pet?.level || 0;
    if (petLevel === 3) return withpet3;
    if (petLevel === 2) return withpet2;
    if (petLevel === 1) return withpet1;
    const armor = player?.armor || {};
    const hasHelmet = armor.helmet?.owned && armor.helmet?.durability > 0;
    const hasChest = armor.chestplate?.owned && armor.chestplate?.durability > 0;
    const hasLegs = armor.leggings?.owned && armor.leggings?.durability > 0;
    const hasBoots = armor.boots?.owned && armor.boots?.durability > 0;
    if (hasHelmet && hasChest && hasLegs && hasBoots) return playerFullArmor;
    if (hasHelmet && hasChest && hasLegs) return playerHelmetChestLegs;
    if (hasHelmet && hasChest) return playerHelmetChest;
    if (hasHelmet) return playerHelmet;
    return playerDefault;
  };

  return (
    <div style={{ background: '#1a1a0a', border: '2px solid #3a3a1a', borderRadius: '4px', padding: '12px' }}>
      <div style={{ fontSize: '10px', fontWeight: '900', color: '#888', marginBottom: '10px', letterSpacing: '3px', borderBottom: '1px solid #3a3a1a', paddingBottom: '8px' }}>
        SURVIVOR {player?.pet?.level > 0 ? `+ 🐺 LVL${player.pet.level}` : ''}
      </div>
      
      <div style={{ width: '100%', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', background: '#0a0a05', border: '1px solid #3a3a1a', overflow: 'hidden' }}>
        <img src={getPlayerImage()} alt="Survivor" style={{ maxWidth: '95%', maxHeight: '95%', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
      </div>

      <div style={{ marginBottom: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#888', marginBottom: '3px' }}>
          <span>HP</span>
          <span style={{ color: player.hp > 50 ? '#ffaa00' : '#ff4444', fontWeight: 'bold' }}>{player.hp}/100</span>
        </div>
        <div style={{ width: '100%', height: '5px', background: '#0a0a05', border: '1px solid #3a3a1a' }}>
          <div style={{ height: '100%', background: player.hp > 50 ? '#ffaa00' : '#ff4444', width: `${player.hp}%`, transition: '0.3s' }} />
        </div>
      </div>

      <div style={{ marginBottom: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#888', marginBottom: '3px' }}>
          <span>FOOD</span>
          <span style={{ color: '#ffaa00', fontWeight: 'bold' }}>{player.food}/{maxResource}</span>
        </div>
        <div style={{ width: '100%', height: '3px', background: '#0a0a05' }}>
          <div style={{ height: '100%', background: '#ffaa00', width: `${Math.min(100, (player.food / maxResource) * 100)}%` }} />
        </div>
      </div>

      <div style={{ marginBottom: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#888', marginBottom: '3px' }}>
          <span>WATER</span>
          <span style={{ color: '#aa8800', fontWeight: 'bold' }}>{player.water}/{maxResource}</span>
        </div>
        <div style={{ width: '100%', height: '3px', background: '#0a0a05' }}>
          <div style={{ height: '100%', background: '#aa8800', width: `${Math.min(100, (player.water / maxResource) * 100)}%` }} />
        </div>
      </div>

      <div style={{ marginBottom: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#888', marginBottom: '3px' }}>
          <span>XP</span>
          <span style={{ color: '#888', fontWeight: 'bold' }}>{player.xp}/{player.nextLevelXp}</span>
        </div>
        <div style={{ width: '100%', height: '3px', background: '#0a0a05' }}>
          <div style={{ height: '100%', background: '#666', width: `${(player.xp/player.nextLevelXp)*100}%` }} />
        </div>
      </div>

      {player?.pet?.level > 0 && (
        <div style={{ marginTop: '8px', borderTop: '1px solid #3a3a1a', paddingTop: '8px' }}>
          <div style={{ fontSize: '8px', color: '#88ff00', fontWeight: 'bold', marginBottom: '4px' }}>
            🐺 PET: {player.pet.level === 1 ? 'PUPPY' : player.pet.level === 2 ? 'GUARDIAN' : 'CYBER-WOLF'}
          </div>
          <div style={{ width: '100%', height: '3px', background: '#0a0a05' }}>
            <div style={{ height: '100%', background: '#88ff00', width: `${player.pet.food}%` }} />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', marginTop: '8px', borderTop: '1px solid #3a3a1a', paddingTop: '8px' }}>
        <span style={{ color: '#ff44ff', fontWeight: 'bold' }}>💪 {player.power || 0} PWR</span>
        <span style={{ color: '#ffaa00', fontWeight: 'bold' }}>LVL {player.level}</span>
      </div>
    </div>
  );
}