import React from 'react';
import pistolDragonImg from '../assets/pistol_dragon.png';
import shotgunDragonImg from '../assets/shotgun_dragon.png';
import knifeDragonImg from '../assets/knife_dragon.png';
import fistsDragonImg from '../assets/fists_dragon.png';
import pistolFrostImg from '../assets/pistol_frost.png';
import shotgunFrostImg from '../assets/shotgun_frost.png';
import knifeFrostImg from '../assets/knife_frost.png';
import fistsFrostImg from '../assets/fists_frost.png';
import fistsImg from '../assets/fists.png';
import knifeImg from '../assets/knife.png';
import pistolImg from '../assets/pistol.png';
import shotgunImg from '../assets/shotgun.png';

export default function Arsenal({ player, onAction, onClose }) {
  const weapons = [
    { id: 'fists', name: 'FISTS', defaultImg: fistsImg },
    { id: 'knife', name: 'KNIFE', defaultImg: knifeImg },
    { id: 'pistol', name: 'PISTOL', defaultImg: pistolImg },
    { id: 'shotgun', name: 'SHOTGUN', defaultImg: shotgunImg },
  ];

  const allSkins = {
    fists: { default: fistsImg, dragon: fistsDragonImg, frost: fistsFrostImg },
    knife: { default: knifeImg, dragon: knifeDragonImg, frost: knifeFrostImg },
    pistol: { default: pistolImg, dragon: pistolDragonImg, frost: pistolFrostImg },
    shotgun: { default: shotgunImg, dragon: shotgunDragonImg, frost: shotgunFrostImg },
  };

  const skinNames = { default: 'DEFAULT', dragon: 'DRAGON', frost: 'FROST' };
  const allSkinIds = ['default', 'dragon', 'frost'];

  const hasSkin = (weaponId, skinId) => {
    if (skinId === 'default') return true;
    return player?.skins?.[weaponId]?.[skinId] || false;
  };

  const getEquippedSkin = (weaponId) => player?.equippedSkin?.[weaponId] || 'default';

  const useSkin = (weaponId, skinId) => {
    if (!hasSkin(weaponId, skinId)) return;
    if (skinId === 'default') {
      onAction('removeSkin', { weapon: weaponId });
    } else {
      onAction('equipSkin', { weapon: weaponId, skin: skinId });
    }
    onAction('weapon', { type: weaponId });
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#1a1a0a', border: '3px solid #3a3a1a', padding: '25px', width: '800px', maxHeight: '90vh', overflow: 'auto', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', background: '#4a1a0a', color: '#ff4444', border: '2px solid #6a2a0a', padding: '8px 12px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>

        <div style={{ fontSize: '20px', fontWeight: '900', color: '#ffaa00', marginBottom: '25px', letterSpacing: '3px', textAlign: 'center', borderBottom: '2px solid #3a3a1a', paddingBottom: '15px' }}>
          🔫 ARSENAL
        </div>

        {/* ФИКСИРОВАННАЯ ТАБЛИЦА: 4 оружия x 3 скина = 12 ячеек */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {/* HEADER */}
          <div style={{ display: 'flex', gap: '2px', marginBottom: '2px' }}>
            <div style={{ width: '120px' }}></div>
            {allSkinIds.map(skinId => (
              <div key={skinId} style={{ flex: 1, textAlign: 'center', fontSize: '10px', fontWeight: '900', color: '#888', padding: '8px', background: '#0a0a05', border: '1px solid #3a3a1a' }}>
                {skinNames[skinId]}
              </div>
            ))}
          </div>

          {/* ROWS */}
          {weapons.map(w => (
            <div key={w.id} style={{ display: 'flex', gap: '2px', marginBottom: '2px' }}>
              <div style={{ width: '120px', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: '#0a0a05', border: '1px solid #3a3a1a' }}>
                <img src={w.defaultImg} alt={w.name} style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#ffaa00' }}>{w.name}</span>
              </div>
              {allSkinIds.map(skinId => {
                const owned = hasSkin(w.id, skinId);
                const equipped = getEquippedSkin(w.id) === skinId;
                return (
                  <div key={skinId} style={{
                    flex: 1, textAlign: 'center', padding: '8px',
                    background: equipped ? 'rgba(255,170,0,0.2)' : '#000',
                    border: equipped ? '2px solid #ffaa00' : '1px solid #3a3a1a',
                    opacity: owned ? 1 : 0.3
                  }}>
                    {owned ? (
                      <>
                        <img src={allSkins[w.id][skinId]} alt="" style={{ width: '55px', height: '55px', objectFit: 'contain', marginBottom: '4px' }} />
                        {equipped ? (
                          <button disabled style={{
                            padding: '4px 8px', background: '#1a1a0a', color: '#666', border: '1px solid #3a3a1a',
                            fontWeight: 'bold', fontSize: '8px', width: '100%', borderRadius: '3px', cursor: 'not-allowed'
                          }}>EQUIPPED</button>
                        ) : (
                          <button onClick={() => useSkin(w.id, skinId)} style={{
                            padding: '4px 8px', background: '#ffaa00', color: '#000', border: 'none',
                            cursor: 'pointer', fontWeight: 'bold', fontSize: '8px', width: '100%', borderRadius: '3px'
                          }}>USE</button>
                        )}
                      </>
                    ) : (
                      <div style={{ padding: '20px', color: '#555', fontSize: '10px', fontWeight: 'bold' }}>🔒</div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}