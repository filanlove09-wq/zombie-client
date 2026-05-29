import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import TitleScreen from './components/TitleScreen';
import PlayerCard from './components/PlayerCard';
import Inventory from './components/Inventory';
import ArmorSystem from './components/ArmorSystem';
import Achievements from './components/Achievements';
import BunkerUpgrade from './components/BunkerUpgrade';
import PetSystem from './components/PetSystem';
import Multiplayer from './components/Multiplayer';
import DailyQuests from './components/DailyQuests';
import Hub from './components/Hub';
import StoryNPC from './components/StoryNPC';
import ClanSystem from './components/ClanSystem';

import zombieRunner from './assets/zombie_runner.png';
import zombieStalker from './assets/zombie_stalker.png';
import zombieBrute from './assets/zombie_brute.png';
import zombieSpitter from './assets/zombie_spitter.png';
import zombieScreamer from './assets/zombie_screamer.png';
import zombieTank from './assets/zombie_tank.png';
import zombieDefault from './assets/zombie.png';

const SERVER_URL = 'https://bunker-server-ajt0.onrender.com'; // Заменить на продакшн URL

const isTelegram = !!(window.Telegram?.WebApp?.initData);
const isMobile = isTelegram || /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const PLATFORM = isTelegram ? 'telegram' : isMobile ? 'mobile' : 'pc';

const TABS = [
  { id: 'game', name: 'GAME', icon: '⚔️' },
  { id: 'hub', name: 'ARSENAL', icon: '🔫' },
  { id: 'pet', name: 'PET', icon: '🐺' },
  { id: 'quests', name: 'QUESTS', icon: '📋' },
  { id: 'story', name: 'STORY', icon: '📖' },
  { id: 'clan', name: 'CLAN', icon: '🏰' },
  { id: 'multiplayer', name: 'SOCIAL', icon: '🌐' },
];

export default function App() {
  const { state, setState, handleAction } = useGameLogic(SERVER_URL);
  const [gameStarted, setGameStarted] = useState(false);
  const [activeTab, setActiveTab] = useState('game');
  const [localCd, setLocalCd] = useState(0);

  // QTE state
  const [qteActive, setQteActive] = useState(false);
  const [qteKey, setQteKey] = useState('');
  const [qteTimer, setQteTimer] = useState(0);
  const [attackingSummoned, setAttackingSummoned] = useState(false);
  const [zombieHit, setZombieHit] = useState(false);
  const [qteCirclePos, setQteCirclePos] = useState({ x: 50, y: 50 });

  const prevHpRef = useRef(state.player?.hp || 100);
  const [damageEffect, setDamageEffect] = useState(false);
  const qteKeys = ['Q', 'W', 'E', 'R', 'A', 'S', 'D'];
  const useTouchQTE = PLATFORM !== 'pc';

  // Telegram WebApp настройки
  useEffect(() => {
    if (isTelegram) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      tg.setHeaderColor('#1a1a0a');
      tg.setBackgroundColor('#0d0d05');
      tg.disableVerticalSwipes();
    }
  }, []);

  // Damage effect
  useEffect(() => {
    const currentHp = state.player?.hp;
    const prevHp = prevHpRef.current;
    if (currentHp !== undefined && prevHp !== undefined && currentHp < prevHp) {
      setDamageEffect(true);
      setTimeout(() => setDamageEffect(false), 400);
    }
    prevHpRef.current = currentHp;
  }, [state.player?.hp]);

  // Cooldown & sync
  useEffect(() => { if (state.cdRemaining !== undefined) setLocalCd(state.cdRemaining); }, [state.cdRemaining]);
  useEffect(() => { if (localCd > 0) { const t = setTimeout(() => setLocalCd(localCd - 1), 1000); return () => clearTimeout(t); } }, [localCd]);
  useEffect(() => {
    const i = setInterval(() => {
      fetch(`${SERVER_URL}/status`).then(r => r.json()).then(d => setState(s => ({ ...s, player: d.player, zombie: d.zombie, summonedZombies: d.summonedZombies || [], cdRemaining: d.cdRemaining })));
    }, 5000); return () => clearInterval(i);
  }, [setState]);

  // QTE timer
  useEffect(() => {
    if (qteActive && qteTimer > 0) {
      const t = setTimeout(() => setQteTimer(prev => prev - 1), 100);
      return () => clearTimeout(t);
    } else if (qteActive && qteTimer <= 0) {
      setQteActive(false);
      handleAction('attack', { success: false, target: attackingSummoned ? 'summoned' : 'main' });
      setAttackingSummoned(false);
    }
  }, [qteActive, qteTimer]);

  // Keyboard QTE (PC)
  useEffect(() => {
    if (useTouchQTE) return;
    const handleKeyPress = (e) => {
      if (!qteActive) return;
      const key = e.key.toUpperCase();
      if (key === qteKey) {
        setQteActive(false);
        handleAction('attack', { success: true, perfect: qteTimer > 7, target: attackingSummoned ? 'summoned' : 'main' });
        setAttackingSummoned(false);
        setZombieHit(true);
        setTimeout(() => setZombieHit(false), 400);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [qteActive, qteKey, qteTimer, useTouchQTE, attackingSummoned]);

  const startQTE = useCallback((target = 'main') => {
    if (target === 'summoned') {
      if (!state.summonedZombies || state.summonedZombies.length === 0) return;
      setAttackingSummoned(true);
    } else {
      if (!state.zombie || state.isExploring) return;
      setAttackingSummoned(false);
    }

    if (useTouchQTE) {
      const x = Math.floor(Math.random() * 70) + 15;
      const y = Math.floor(Math.random() * 60) + 20;
      setQteCirclePos({ x, y });
    } else {
      const randomKey = qteKeys[Math.floor(Math.random() * qteKeys.length)];
      setQteKey(randomKey);
    }

    setQteTimer(10);
    setQteActive(true);
  }, [state.zombie, state.isExploring, state.summonedZombies, useTouchQTE]);

  const handleCircleTap = useCallback(() => {
    if (!qteActive || !useTouchQTE) return;
    setQteActive(false);
    handleAction('attack', { success: true, perfect: qteTimer > 7, target: attackingSummoned ? 'summoned' : 'main' });
    setAttackingSummoned(false);
    setZombieHit(true);
    setTimeout(() => setZombieHit(false), 400);
  }, [qteActive, useTouchQTE, qteTimer, attackingSummoned]);

  const getZombieImage = (name) => {
    switch(name) {
      case 'zombie_runner.png': return zombieRunner;
      case 'zombie_stalker.png': return zombieStalker;
      case 'zombie_brute.png': return zombieBrute;
      case 'zombie_spitter.png': return zombieSpitter;
      case 'zombie_screamer.png': return zombieScreamer;
      case 'zombie_tank.png': return zombieTank;
      default: return zombieDefault;
    }
  };

  const getZombieSpecialText = (z) => { if (!z) return ''; switch(z.special) { case 'poison': return '🧪 POISON'; case 'summon': return '📢 SUMMON'; case 'steal': return '⚠️ STEAL'; case 'tank': return '🛡️ TANK'; case 'boss': return '💀 BOSS'; case 'speed': return '🏃 SPEED'; default: return ''; } };
  const getZombieSpecialColor = (z) => { if (!z) return '#888'; switch(z.special) { case 'poison': return '#00ff00'; case 'summon': return '#ff4444'; case 'steal': return '#ffaa00'; case 'tank': return '#888'; case 'boss': return '#ff0000'; case 'speed': return '#ffff00'; default: return '#888'; } };
  const hasSummoned = state.summonedZombies && state.summonedZombies.length > 0;
  const hasMainZombie = state.zombie && !state.isExploring;

  const explore = async () => { if (localCd > 0 || state.isExploring) return; setState(prev => ({ ...prev, isExploring: true })); await handleAction('explore'); };

  if (!gameStarted) return <TitleScreen onStart={() => setGameStarted(true)} />;
  if (!state.player) return <div style={{ background: '#1a1a0a', color: '#ffaa00', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '900' }}>LOADING...</div>;

  return (
    <div style={{ height: '100vh', background: 'linear-gradient(180deg, #1a1a0a 0%, #0d0d05 100%)', color: '#ccc', fontFamily: "'Courier New', monospace", display: 'flex', flexDirection: 'column' }}>
      {/* TOP NAVIGATION */}
      <div style={{ display: 'flex', background: '#0a0a05', borderBottom: '2px solid #3a3a1a', padding: '0 10px', overflowX: 'auto' }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            flex: 1, padding: '12px 6px', background: activeTab === tab.id ? '#1a1a0a' : 'transparent',
            color: activeTab === tab.id ? '#ffaa00' : '#888', border: 'none',
            borderBottom: activeTab === tab.id ? '2px solid #ffaa00' : 'none',
            cursor: 'pointer', fontWeight: '900', fontSize: PLATFORM === 'telegram' ? '9px' : '10px', letterSpacing: '1px', fontFamily: "'Courier New', monospace"
          }}>{tab.icon} {tab.name}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {activeTab === 'game' && (
          <div className={`game-container ${damageEffect ? 'animate-player-damage' : ''}`} style={{
            display: 'flex', height: '100%', padding: PLATFORM === 'telegram' ? '10px' : '20px',
            boxSizing: 'border-box', flexDirection: PLATFORM === 'telegram' ? 'column' : 'row'
          }}>
            <aside style={{
              width: PLATFORM === 'telegram' ? '100%' : '380px',
              minWidth: PLATFORM === 'telegram' ? '100%' : '380px',
              display: 'flex', flexDirection: 'column', gap: '8px',
              overflow: 'auto', background: 'rgba(20,20,5,0.9)', borderRadius: '8px',
              padding: '10px', border: '2px solid #3a3a1a',
              marginRight: PLATFORM === 'telegram' ? 0 : '20px',
              marginBottom: PLATFORM === 'telegram' ? '10px' : 0,
              maxHeight: PLATFORM === 'telegram' ? '30vh' : '100%'
            }}>
              <PlayerCard player={state.player} />
              <Inventory player={state.player} onAction={handleAction} />
              <div style={{ background: '#1a1a0a', border: '2px solid #3a3a1a', borderRadius: '6px', padding: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '900', color: '#888', letterSpacing: '2px' }}>CRAFTING</span>
                  <span style={{ fontSize: '10px', color: '#ffaa00', fontWeight: 'bold' }}>🔧 {state.player?.scrap || 0} SCRAP</span>
                </div>
                <button onClick={() => handleAction('craft')} disabled={(state.player?.scrap || 0) < 5}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '2px solid #ffaa00', background: 'transparent', color: '#ffaa00', fontWeight: '900', cursor: 'pointer', opacity: (state.player?.scrap || 0) < 5 ? 0.3 : 1, fontSize: '11px', letterSpacing: '1px' }}>
                  CRAFT MEDKIT (5)
                </button>
              </div>
              <div style={{ background: '#1a1a0a', border: '2px solid #ffaa00', borderRadius: '6px', padding: '10px', textAlign: 'center', fontWeight: '900', fontSize: '16px', color: '#ffaa00' }}>
                {state.player?.coins || 0} COINS
              </div>
              <Achievements player={state.player} />
              <BunkerUpgrade player={state.player} onAction={handleAction} />
            </aside>

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
              <div style={{ width: '100%', height: PLATFORM === 'telegram' ? '300px' : '420px', background: '#0a0a05', borderRadius: '4px', border: '3px solid #3a3a1a', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden' }}>
                {/* Summoned zombies */}
                {hasSummoned && (
                  <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 5, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ background: 'rgba(255,0,0,0.2)', border: '2px solid #ff4444', padding: '6px 10px', borderRadius: '4px' }}>
                      <div style={{ fontSize: '9px', color: '#ff4444', fontWeight: '900' }}>⚠️ SUMMONED: {state.summonedZombies.length}</div>
                    </div>
                    {state.summonedZombies.map((sz, i) => (
                      <div key={i} style={{ background: '#0a0a05', border: '1px solid #ff4444', padding: '4px 8px', borderRadius: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '16px' }}>🧟</span>
                        <div>
                          <div style={{ fontSize: '8px', color: '#ff4444', fontWeight: 'bold' }}>RUNNER {i+1}</div>
                          <div style={{ width: '60px', height: '3px', background: '#1a1a0a' }}>
                            <div style={{ height: '100%', background: '#ff4444', width: `${(sz.hp/sz.maxHp)*100}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Main zombie info */}
                {hasMainZombie && (
                  <div style={{ position: 'absolute', top: hasSummoned ? '110px' : '25px', textAlign: 'center', zIndex: 2 }}>
                    <div style={{ color: '#ff4444', fontSize: '11px', fontWeight: '900', marginBottom: '4px', letterSpacing: '3px' }}>{state.zombie.type}</div>
                    {state.zombie.power && <div style={{ fontSize: '8px', color: '#ff44ff', marginBottom: '3px' }}>⚡ PWR: {state.zombie.power}</div>}
                    {getZombieSpecialText(state.zombie) && (
                      <div style={{ fontSize: '7px', fontWeight: 'bold', marginBottom: '6px', padding: '2px 8px', borderRadius: '3px', display: 'inline-block', background: 'rgba(0,0,0,0.8)', border: `1px solid ${getZombieSpecialColor(state.zombie)}`, color: getZombieSpecialColor(state.zombie) }}>
                        {getZombieSpecialText(state.zombie)}
                      </div>
                    )}
                    <div style={{ width: '180px', height: '5px', background: '#1a1a0a', border: '1px solid #3a3a1a' }}>
                      <div style={{ height: '100%', background: '#ff4444', width: `${(state.zombie.hp/state.zombie.maxHp)*100}%`, transition: '0.3s' }} />
                    </div>
                  </div>
                )}

                {state.isExploring ? (
                  <div style={{ marginBottom: '200px', color: '#ffaa00', fontSize: '16px', fontWeight: '900' }}>SCOUTING...</div>
                ) : hasMainZombie ? (
                  <>
                    <img src={getZombieImage(state.zombie.image)} className={zombieHit ? 'animate-zombie-hit' : ''}
                      style={{ maxHeight: '55%', maxWidth: '85%', marginBottom: '20px', objectFit: 'contain' }} alt="" />

                    {/* Keyboard QTE overlay */}
                    {qteActive && !useTouchQTE && (
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', zIndex: 10 }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '12px', color: '#ffaa00', marginBottom: '10px', fontWeight: '900' }}>PRESS THE KEY!</div>
                          <div className="animate-pulse" style={{ width: '100px', height: '100px', background: qteTimer>7?'#ffaa00':qteTimer>4?'#ff6600':'#ff4444', border: '3px solid #3a3a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', fontWeight: '900', color: '#000', margin: '0 auto 20px' }}>{qteKey}</div>
                          <div style={{ width: '200px', height: '6px', background: '#1a1a0a', border: '1px solid #3a3a1a', margin: '0 auto' }}>
                            <div style={{ height: '100%', width: `${(qteTimer/10)*100}%`, background: qteTimer>7?'#ffaa00':qteTimer>4?'#ff6600':'#ff4444', transition: '0.1s' }} />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Touch QTE circle */}
                    {qteActive && useTouchQTE && (
                      <div
                        onTouchStart={handleCircleTap}
                        onClick={handleCircleTap}
                        style={{
                          position: 'absolute',
                          left: `${qteCirclePos.x}%`,
                          top: `${qteCirclePos.y}%`,
                          width: '80px', height: '80px',
                          background: qteTimer > 7 ? '#00ff88' : qteTimer > 4 ? '#ffaa00' : '#ff4444',
                          borderRadius: '50%',
                          border: '4px solid #fff',
                          zIndex: 20,
                          transform: 'translate(-50%, -50%)',
                          boxShadow: '0 0 30px rgba(255,255,255,0.5)',
                          cursor: 'pointer'
                        }}
                      />
                    )}
                  </>
                ) : (
                  <div style={{ marginBottom: '180px', color: '#1a1a0a', fontSize: '36px', fontWeight: '900', letterSpacing: '5px' }}>SECTOR CLEAR</div>
                )}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
                <button onClick={explore} disabled={localCd > 0 || state.isExploring}
                  style={{ flex: 2, background: localCd > 0 ? '#1a1a0a' : '#ffaa00', color: '#000', borderRadius: '4px', height: '60px', fontWeight: '900', border: '2px solid #3a3a1a', cursor: 'pointer', fontSize: '14px', letterSpacing: '2px' }}>
                  {localCd > 0 ? `REST (${localCd}s)` : 'SCOUT'}
                </button>
                {hasSummoned && !hasMainZombie ? (
                  <button onClick={() => startQTE('summoned')} disabled={state.isExploring || qteActive}
                    style={{ flex: 1, background: '#ff4444', color: '#fff', borderRadius: '4px', fontWeight: '900', border: '2px solid #3a1a0a', cursor: 'pointer', fontSize: '14px', letterSpacing: '2px' }}>
                    {qteActive ? 'HIT!' : 'KILL SUMMONED'}
                  </button>
                ) : (
                  <button onClick={() => startQTE('main')} disabled={!hasMainZombie || state.isExploring || qteActive}
                    style={{ flex: 1, background: qteActive ? '#ff6600' : '#cc0000', color: '#fff', borderRadius: '4px', fontWeight: '900', border: '2px solid #3a1a0a', cursor: 'pointer', fontSize: '14px', letterSpacing: '2px' }}>
                    {qteActive ? 'HIT!' : 'ATTACK'}
                  </button>
                )}
              </div>

              <div className="animate-slide-down" style={{ marginTop: '15px', padding: '12px', background: '#1a1a0a', borderRadius: '4px', color: '#ffaa00', fontSize: '11px', textAlign: 'center', border: '1px solid #3a3a1a', fontWeight: 'bold' }}>
                {state.result || state.text || 'READY TO SCOUT'}
              </div>
              <div style={{ marginTop: '15px' }}><ArmorSystem player={state.player} onAction={handleAction} /></div>
            </main>
          </div>
        )}

        {activeTab === 'hub' && <Hub player={state.player} onAction={handleAction} onClose={() => setActiveTab('game')} />}
        {activeTab === 'pet' && <PetSystem player={state.player} onAction={handleAction} onClose={() => setActiveTab('game')} />}
        {activeTab === 'quests' && <DailyQuests player={state.player} onAction={handleAction} onClose={() => setActiveTab('game')} />}
        {activeTab === 'story' && <StoryNPC player={state.player} onAction={handleAction} onClose={() => setActiveTab('game')} />}
        {activeTab === 'clan' && <ClanSystem player={state.player} onAction={handleAction} onClose={() => setActiveTab('game')} />}
        {activeTab === 'multiplayer' && <Multiplayer player={state.player} onClose={() => setActiveTab('game')} />}
      </div>
    </div>
  );
}