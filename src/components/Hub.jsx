import React, { useState } from 'react';
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
import caseDragonImg from '../assets/case_dragon.png';
import caseFrostImg from '../assets/case_frost.png';

const TABS = [
  { id: 'arsenal', name: 'ARSENAL', icon: '🔫' },
  { id: 'trader', name: 'TRADER', icon: '🛒' },
  { id: 'market', name: 'MARKET', icon: '🎁' },
];

export default function Hub({ player, onAction, onClose }) {
  const [activeTab, setActiveTab] = useState('arsenal');

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#1a1a0a', border: '3px solid #3a3a1a', width: '800px', height: '600px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10, background: '#4a1a0a', color: '#ff4444', border: '2px solid #6a2a0a', padding: '8px 12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>✕</button>

        <div style={{ display: 'flex', borderBottom: '2px solid #3a3a1a', background: '#0a0a05' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              flex: 1, padding: '14px', background: activeTab === tab.id ? '#1a1a0a' : 'transparent',
              color: activeTab === tab.id ? '#ffaa00' : '#888', border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #ffaa00' : 'none',
              cursor: 'pointer', fontWeight: '900', fontSize: '13px', letterSpacing: '2px', fontFamily: "'Courier New', monospace"
            }}>{tab.icon} {tab.name}</button>
          ))}
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
          {activeTab === 'arsenal' && <ArsenalTab player={player} onAction={onAction} />}
          {activeTab === 'trader' && <TraderTab player={player} onAction={onAction} />}
          {activeTab === 'market' && <MarketTab player={player} onAction={onAction} />}
        </div>
      </div>
    </div>
  );
}

function ArsenalTab({ player, onAction }) {
  const weapons = [
    { id: 'fists', name: 'FISTS', defaultImg: fistsImg, price: 0 },
    { id: 'knife', name: 'KNIFE', defaultImg: knifeImg, price: 100 },
    { id: 'pistol', name: 'PISTOL', defaultImg: pistolImg, price: 350 },
    { id: 'shotgun', name: 'SHOTGUN', defaultImg: shotgunImg, price: 800 },
  ];
  const allSkins = {
    fists: { default: fistsImg, dragon: fistsDragonImg, frost: fistsFrostImg },
    knife: { default: knifeImg, dragon: knifeDragonImg, frost: knifeFrostImg },
    pistol: { default: pistolImg, dragon: pistolDragonImg, frost: pistolFrostImg },
    shotgun: { default: shotgunImg, dragon: shotgunDragonImg, frost: shotgunFrostImg },
  };
  const skinNames = { default: 'DEFAULT', dragon: 'DRAGON', frost: 'FROST' };
  const allSkinIds = ['default', 'dragon', 'frost'];
  const hasSkin = (wid, sid) => sid === 'default' || player?.skins?.[wid]?.[sid];
  const equipped = (wid) => player?.equippedSkin?.[wid] || 'default';
  const hasWeapon = (wid) => player?.hasWeapons?.[wid] || wid === 'fists';

  return (
    <div>
      <div style={{ fontSize: '16px', fontWeight: '900', color: '#ffaa00', marginBottom: '15px', textAlign: 'center', letterSpacing: '2px' }}>🔫 ARSENAL</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ display: 'flex', gap: '2px', marginBottom: '2px' }}>
          <div style={{ width: '110px' }}></div>
          {allSkinIds.map(sid => <div key={sid} style={{ flex: 1, textAlign: 'center', fontSize: '9px', fontWeight: '900', color: '#888', padding: '6px', background: '#0a0a05', border: '1px solid #3a3a1a' }}>{skinNames[sid]}</div>)}
        </div>
        {weapons.map(w => (
          <div key={w.id} style={{ display: 'flex', gap: '2px', marginBottom: '2px' }}>
            <div style={{ width: '110px', display: 'flex', alignItems: 'center', gap: '6px', padding: '6px', background: '#0a0a05', border: '1px solid #3a3a1a' }}>
              <img src={w.defaultImg} alt="" style={{ width: '25px', height: '25px' }} />
              <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#ffaa00' }}>{w.name}</span>
            </div>
            {allSkinIds.map(sid => {
              const owned = hasSkin(w.id, sid);
              const eq = equipped(w.id) === sid;
              const canBuy = !hasWeapon(w.id) && sid === 'default';
              return (
                <div key={sid} style={{ flex: 1, textAlign: 'center', padding: '6px', background: eq ? 'rgba(255,170,0,0.2)' : '#000', border: eq ? '2px solid #ffaa00' : '1px solid #3a3a1a', opacity: owned ? 1 : 0.3 }}>
                  {owned ? (
                    <>
                      <img src={allSkins[w.id][sid]} alt="" style={{ width: '45px', height: '45px', objectFit: 'contain', marginBottom: '3px' }} />
                      {eq ? <button disabled style={{ padding: '3px 6px', background: '#1a1a0a', color: '#666', border: '1px solid #3a3a1a', fontWeight: 'bold', fontSize: '7px', width: '100%', borderRadius: '3px' }}>EQUIPPED</button>
                      : <button onClick={() => { if (sid === 'default') onAction('removeSkin', { weapon: w.id }); else onAction('equipSkin', { weapon: w.id, skin: sid }); onAction('weapon', { type: w.id }); }} style={{ padding: '3px 6px', background: '#ffaa00', color: '#000', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '7px', width: '100%', borderRadius: '3px' }}>USE</button>}
                    </>
                  ) : canBuy ? <button onClick={() => onAction('buy', { item: w.id })} style={{ padding: '8px', background: (player?.coins||0)>=w.price?'#ffaa00':'#1a1a0a', color: (player?.coins||0)>=w.price?'#000':'#666', border: '1px solid #3a3a1a', cursor: (player?.coins||0)>=w.price?'pointer':'not-allowed', fontWeight: 'bold', fontSize: '8px', width: '100%' }}>BUY ({w.price})</button>
                  : <div style={{ padding: '15px', color: '#555', fontSize: '10px', fontWeight: 'bold' }}>🔒</div>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function TraderTab({ player, onAction }) {
  const [mode, setMode] = useState('buy');
  const buyItems = [
    { id: 'medkit_pack', name: 'MEDKIT PACK', icon: '💉', desc: '3 medkits', price: 80 },
    { id: 'food_pack', name: 'FOOD CRATE', icon: '🍱', desc: '5 food', price: 50 },
    { id: 'water_pack', name: 'WATER', icon: '🥤', desc: '5 bottles', price: 40 },
    { id: 'scrap_pack', name: 'SCRAP', icon: '🔧', desc: '20 scrap', price: 30 },
    { id: 'xp_boost', name: 'XP SCROLL', icon: '📜', desc: '+100 XP', price: 200 },
  ];
  const sellItems = [
    { id: 'sell_scrap', name: 'SELL SCRAP', icon: '🔧', price: 8 },
    { id: 'sell_food', name: 'SELL FOOD', icon: '🍱', price: 5 },
    { id: 'sell_water', name: 'SELL WATER', icon: '🥤', price: 4 },
    { id: 'sell_medkit', name: 'SELL MEDKIT', icon: '💉', price: 15 },
  ];
  return (
    <div>
      <div style={{ fontSize: '16px', fontWeight: '900', color: '#ffaa00', marginBottom: '15px', textAlign: 'center', letterSpacing: '2px' }}>🛒 TRADER</div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
        <button onClick={() => setMode('buy')} style={{ flex: 1, padding: '10px', background: mode==='buy'?'#ffaa00':'#1a1a0a', color: mode==='buy'?'#000':'#888', border: '1px solid #3a3a1a', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>🛍️ BUY</button>
        <button onClick={() => setMode('sell')} style={{ flex: 1, padding: '10px', background: mode==='sell'?'#ff6600':'#1a1a0a', color: mode==='sell'?'#000':'#888', border: '1px solid #3a3a1a', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>💰 SELL</button>
      </div>
      <div style={{ textAlign: 'center', color: '#ffaa00', fontWeight: 'bold', marginBottom: '15px' }}>COINS: {player?.coins||0}</div>
      {mode === 'buy' && buyItems.map(item => (
        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#0a0a05', border: '1px solid #3a3a1a', marginBottom: '6px' }}>
          <span style={{ fontSize: '22px' }}>{item.icon}</span>
          <div style={{ flex: 1 }}><div style={{ fontSize: '10px', color: '#ffaa00', fontWeight: 'bold' }}>{item.name}</div><div style={{ fontSize: '8px', color: '#888' }}>{item.desc}</div></div>
          <button onClick={() => onAction('traderBuy', { item: item.id })} disabled={(player?.coins||0) < item.price} style={{ padding: '8px 14px', background: (player?.coins||0)>=item.price?'#ffaa00':'#1a1a0a', color: (player?.coins||0)>=item.price?'#000':'#666', border: '1px solid #3a3a1a', cursor: (player?.coins||0)>=item.price?'pointer':'not-allowed', fontWeight: 'bold', fontSize: '10px' }}>{item.price}💰</button>
        </div>
      ))}
      {mode === 'sell' && sellItems.map(item => (
        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#0a0a05', border: '1px solid #3a3a1a', marginBottom: '6px' }}>
          <span style={{ fontSize: '22px' }}>{item.icon}</span>
          <div style={{ flex: 1 }}><div style={{ fontSize: '10px', color: '#ff6600', fontWeight: 'bold' }}>{item.name}</div></div>
          <button onClick={() => onAction('traderSell', { item: item.id })} style={{ padding: '8px 14px', background: '#ff6600', color: '#000', border: '1px solid #3a3a1a', cursor: 'pointer', fontWeight: 'bold', fontSize: '10px' }}>+{item.price}💰</button>
        </div>
      ))}
    </div>
  );
}

function MarketTab({ player, onAction }) {
  const [isOpening, setIsOpening] = useState(false);
  const [reward, setReward] = useState(null);
  const [scrollItems, setScrollItems] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);

  const cases = {
    dragon: { name: 'DRAGON CASE', img: caseDragonImg, color: '#ff6600', price: 100,
      items: [
        { name: 'DRAGON FISTS', img: fistsDragonImg, weapon: 'fists', skin: 'dragon', rarity: 'COMMON', color: '#888', chance: 0.40 },
        { name: 'DRAGON PISTOL', img: pistolDragonImg, weapon: 'pistol', skin: 'dragon', rarity: 'RARE', color: '#ffaa00', chance: 0.30 },
        { name: 'DRAGON SHOTGUN', img: shotgunDragonImg, weapon: 'shotgun', skin: 'dragon', rarity: 'EPIC', color: '#cc6600', chance: 0.20 },
        { name: 'DRAGON KNIFE', img: knifeDragonImg, weapon: 'knife', skin: 'dragon', rarity: 'LEGENDARY', color: '#ff6600', chance: 0.10 },
      ]
    },
    frost: { name: 'FROST CASE', img: caseFrostImg, color: '#00aaff', price: 100,
      items: [
        { name: 'FROST FISTS', img: fistsFrostImg, weapon: 'fists', skin: 'frost', rarity: 'COMMON', color: '#888', chance: 0.40 },
        { name: 'FROST PISTOL', img: pistolFrostImg, weapon: 'pistol', skin: 'frost', rarity: 'RARE', color: '#00aaff', chance: 0.30 },
        { name: 'FROST SHOTGUN', img: shotgunFrostImg, weapon: 'shotgun', skin: 'frost', rarity: 'EPIC', color: '#0088ff', chance: 0.20 },
        { name: 'FROST KNIFE', img: knifeFrostImg, weapon: 'knife', skin: 'frost', rarity: 'LEGENDARY', color: '#0066ff', chance: 0.10 },
      ]
    }
  };

  const [selectedCase, setSelectedCase] = useState('dragon');
  const currentCase = cases[selectedCase];

  const openCase = () => {
    if (isOpening) return;
    if ((player?.coins || 0) < currentCase.price) return;
    setIsOpening(true);
    setReward(null);
    onAction('openCase', { case: selectedCase });
    const scrollArray = [];
    for (let i = 0; i < 25; i++) scrollArray.push(currentCase.items[Math.floor(Math.random() * currentCase.items.length)]);
    const rand = Math.random();
    let cumulative = 0;
    let selected = currentCase.items[currentCase.items.length - 1];
    for (let i = 0; i < currentCase.items.length; i++) { cumulative += currentCase.items[i].chance; if (rand < cumulative) { selected = currentCase.items[i]; break; } }
    scrollArray.push(selected);
    setScrollItems(scrollArray);
    setScrollPosition(0);
    let pos = 0;
    const interval = setInterval(() => { pos += 1; setScrollPosition(pos); if (pos >= scrollArray.length - 1) { clearInterval(interval); setTimeout(() => { setReward(selected); setIsOpening(false); onAction('equipSkin', { weapon: selected.weapon, skin: selected.skin }); }, 600); } }, 70);
  };

  return (
    <div>
      <div style={{ fontSize: '16px', fontWeight: '900', color: '#ffaa00', marginBottom: '15px', textAlign: 'center', letterSpacing: '2px' }}>🎁 MARKET</div>
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '20px' }}>
        {Object.keys(cases).map(key => (
          <button key={key} onClick={() => setSelectedCase(key)} style={{ padding: '12px 20px', background: selectedCase === key ? cases[key].color : '#1a1a0a', color: selectedCase === key ? '#000' : '#888', border: `2px solid ${cases[key].color}`, cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', letterSpacing: '1px' }}>
            <img src={cases[key].img} alt="" style={{ width: '25px', height: '25px', objectFit: 'contain', marginRight: '6px', verticalAlign: 'middle' }} />{cases[key].name}
          </button>
        ))}
      </div>
      {!isOpening && !reward && (
        <div style={{ textAlign: 'center' }}>
          <img src={currentCase.img} alt="" style={{ width: '100px', height: '100px', objectFit: 'contain', marginBottom: '10px' }} />
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '15px' }}>
            {currentCase.items.map(item => <div key={item.weapon} style={{ fontSize: '8px', color: item.color, fontWeight: 'bold', background: '#0a0a05', padding: '4px 8px', border: '1px solid #3a3a1a' }}>{item.rarity}</div>)}
          </div>
          <button onClick={openCase} disabled={(player?.coins||0) < currentCase.price} style={{ padding: '12px 40px', background: (player?.coins||0)>=currentCase.price?currentCase.color:'#1a1a0a', color: (player?.coins||0)>=currentCase.price?'#000':'#666', border: `2px solid ${currentCase.color}`, fontWeight: '900', cursor: (player?.coins||0)>=currentCase.price?'pointer':'not-allowed', fontSize: '14px', letterSpacing: '2px' }}>OPEN ({currentCase.price}💰)</button>
        </div>
      )}
      {isOpening && scrollItems.length > 0 && (
        <div style={{ height: '100px', overflow: 'hidden', background: '#0a0a05', border: '2px solid #3a3a1a', borderRadius: '6px' }}>
          <div style={{ transform: `translateY(-${scrollPosition * 100}px)`, transition: '0.07s linear' }}>
            {scrollItems.map((item, i) => (
              <div key={i} style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', borderBottom: i===scrollItems.length-1?`3px solid ${currentCase.color}`:'1px solid #3a3a1a', background: i===scrollItems.length-1?'rgba(255,170,0,0.1)':'transparent' }}>
                <img src={item.img} alt="" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                <span style={{ color: item.color, fontWeight: 'bold', fontSize: '14px' }}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {reward && (
        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <div style={{ fontSize: '40px' }}>🎉</div>
          <img src={reward.img} alt="" style={{ width: '120px', height: '120px', objectFit: 'contain', marginBottom: '10px' }} />
          <div style={{ color: reward.color, fontWeight: '900', fontSize: '16px' }}>{reward.rarity}</div>
          <div style={{ color: '#ffaa00', fontWeight: 'bold', fontSize: '14px', marginTop: '5px' }}>{reward.name}</div>
        </div>
      )}
    </div>
  );
}