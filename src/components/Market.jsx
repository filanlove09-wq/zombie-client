import React, { useState } from 'react';
import caseDragonImg from '../assets/case_dragon.png';
import caseFrostImg from '../assets/case_frost.png';
import pistolDragonImg from '../assets/pistol_dragon.png';
import shotgunDragonImg from '../assets/shotgun_dragon.png';
import knifeDragonImg from '../assets/knife_dragon.png';
import fistsDragonImg from '../assets/fists_dragon.png';
import pistolFrostImg from '../assets/pistol_frost.png';
import shotgunFrostImg from '../assets/shotgun_frost.png';
import knifeFrostImg from '../assets/knife_frost.png';
import fistsFrostImg from '../assets/fists_frost.png';

export default function Market({ player, onAction, onClose }) {
  const [isOpening, setIsOpening] = useState(false);
  const [reward, setReward] = useState(null);
  const [scrollItems, setScrollItems] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [selectedCase, setSelectedCase] = useState('dragon');

  const cases = {
    dragon: {
      name: 'DRAGON CASE', img: caseDragonImg, color: '#ff6600', price: 100,
      items: [
        { name: 'DRAGON FISTS', img: fistsDragonImg, weapon: 'fists', skin: 'dragon', rarity: 'COMMON', color: '#888', chance: 0.40 },
        { name: 'DRAGON PISTOL', img: pistolDragonImg, weapon: 'pistol', skin: 'dragon', rarity: 'RARE', color: '#ffaa00', chance: 0.30 },
        { name: 'DRAGON SHOTGUN', img: shotgunDragonImg, weapon: 'shotgun', skin: 'dragon', rarity: 'EPIC', color: '#cc6600', chance: 0.20 },
        { name: 'DRAGON KNIFE', img: knifeDragonImg, weapon: 'knife', skin: 'dragon', rarity: 'LEGENDARY', color: '#ff6600', chance: 0.10 },
      ]
    },
    frost: {
      name: 'FROST CASE', img: caseFrostImg, color: '#00aaff', price: 100,
      items: [
        { name: 'FROST FISTS', img: fistsFrostImg, weapon: 'fists', skin: 'frost', rarity: 'COMMON', color: '#888', chance: 0.40 },
        { name: 'FROST PISTOL', img: pistolFrostImg, weapon: 'pistol', skin: 'frost', rarity: 'RARE', color: '#00aaff', chance: 0.30 },
        { name: 'FROST SHOTGUN', img: shotgunFrostImg, weapon: 'shotgun', skin: 'frost', rarity: 'EPIC', color: '#0088ff', chance: 0.20 },
        { name: 'FROST KNIFE', img: knifeFrostImg, weapon: 'knife', skin: 'frost', rarity: 'LEGENDARY', color: '#0066ff', chance: 0.10 },
      ]
    }
  };

  const currentCase = cases[selectedCase];

  const openCase = () => {
    if (isOpening) return;
    if ((player?.coins || 0) < currentCase.price) return;

    setIsOpening(true);
    setReward(null);
    onAction('openCase', { case: selectedCase });

    const scrollArray = [];
    for (let i = 0; i < 30; i++) scrollArray.push(currentCase.items[Math.floor(Math.random() * currentCase.items.length)]);

    const rand = Math.random();
    let cumulative = 0;
    let selected = currentCase.items[currentCase.items.length - 1];
    for (let i = 0; i < currentCase.items.length; i++) {
      cumulative += currentCase.items[i].chance;
      if (rand < cumulative) { selected = currentCase.items[i]; break; }
    }
    scrollArray.push(selected);
    setScrollItems(scrollArray);
    setScrollPosition(0);

    let pos = 0;
    const interval = setInterval(() => {
      pos += 1;
      setScrollPosition(pos);
      if (pos >= scrollArray.length - 1) {
        clearInterval(interval);
        setTimeout(() => {
          setReward(selected);
          setIsOpening(false);
          onAction('equipSkin', { weapon: selected.weapon, skin: selected.skin });
        }, 800);
      }
    }, 80);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#1a1a0a', border: '3px solid #3a3a1a', padding: '30px', width: '600px', position: 'relative', textAlign: 'center' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', background: '#4a1a0a', color: '#ff4444', border: '2px solid #6a2a0a', padding: '8px 12px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>

        <div style={{ fontSize: '20px', fontWeight: '900', color: '#ffaa00', marginBottom: '25px', letterSpacing: '3px' }}>
          🛒 MARKET
        </div>

        {/* ВЫБОР КЕЙСА */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '25px' }}>
          {Object.keys(cases).map(key => (
            <div key={key} onClick={() => { setSelectedCase(key); setReward(null); }} style={{
              background: selectedCase === key ? 'rgba(255,170,0,0.1)' : '#0a0a05',
              border: selectedCase === key ? `2px solid ${cases[key].color}` : '1px solid #3a3a1a',
              padding: '15px', cursor: 'pointer', borderRadius: '8px', textAlign: 'center', width: '150px'
            }}>
              <img src={cases[key].img} alt="" style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '8px' }} />
              <div style={{ color: '#ffaa00', fontWeight: 'bold', fontSize: '12px' }}>{cases[key].name}</div>
              <div style={{ color: '#888', fontSize: '10px', marginTop: '4px' }}>{cases[key].price} COINS</div>
            </div>
          ))}
        </div>

        {/* ОТКРЫТИЕ КЕЙСА */}
        {!isOpening && !reward && (
          <button onClick={openCase} disabled={(player?.coins || 0) < currentCase.price} style={{
            padding: '14px 40px', background: (player?.coins || 0) >= currentCase.price ? currentCase.color : '#1a1a0a',
            color: (player?.coins || 0) >= currentCase.price ? '#000' : '#666',
            border: `2px solid ${currentCase.color}`, fontWeight: '900', cursor: (player?.coins || 0) >= currentCase.price ? 'pointer' : 'not-allowed',
            fontSize: '15px', letterSpacing: '2px'
          }}>
            OPEN {currentCase.name} ({currentCase.price} COINS)
          </button>
        )}

        {/* АНИМАЦИЯ ПРОКРУТКИ */}
        {isOpening && scrollItems.length > 0 && (
          <div style={{ height: '120px', overflow: 'hidden', background: '#0a0a05', border: '2px solid #3a3a1a', borderRadius: '8px' }}>
            <div style={{ transform: `translateY(-${scrollPosition * 120}px)`, transition: '0.08s linear' }}>
              {scrollItems.map((item, i) => (
                <div key={i} style={{
                  height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px',
                  borderBottom: i === scrollItems.length - 1 ? `3px solid ${currentCase.color}` : '1px solid #3a3a1a',
                  background: i === scrollItems.length - 1 ? 'rgba(255,170,0,0.1)' : 'transparent'
                }}>
                  <img src={item.img} alt="" style={{ width: '70px', height: '70px', objectFit: 'contain' }} />
                  <span style={{ color: item.color, fontWeight: 'bold', fontSize: '14px', letterSpacing: '1px' }}>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* НАГРАДА */}
        {reward && (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <div style={{ fontSize: '50px', marginBottom: '15px' }}>🎉</div>
            <img src={reward.img} alt="" style={{ width: '150px', height: '150px', objectFit: 'contain', marginBottom: '15px' }} />
            <div style={{ color: reward.color, fontWeight: '900', fontSize: '18px', letterSpacing: '2px', marginBottom: '5px' }}>{reward.rarity}</div>
            <div style={{ color: '#ffaa00', fontWeight: 'bold', fontSize: '16px' }}>{reward.name}</div>
            <button onClick={() => setReward(null)} style={{
              marginTop: '20px', padding: '10px 30px', background: '#ffaa00', color: '#000',
              border: '2px solid #3a3a1a', fontWeight: '900', cursor: 'pointer', fontSize: '12px', letterSpacing: '1px'
            }}>OK</button>
          </div>
        )}
      </div>
    </div>
  );
}