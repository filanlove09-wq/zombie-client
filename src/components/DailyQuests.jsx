import React, { useState, useEffect } from 'react';

const QUESTS = [
  { id: 'kill_5', text: 'Kill 5 zombies', target: 5, reward: '50 coins', icon: '💀', check: (p) => (p.totalKills || 0) >= 5 },
  { id: 'scout_10', text: 'Scout 10 times', target: 10, reward: '30 XP', icon: '🔍', check: (p) => (p.totalExplores || 0) >= 10 },
  { id: 'collect_100', text: 'Collect 100 scrap', target: 100, reward: '80 coins', icon: '🔧', check: (p) => (p.totalScrap || 0) >= 100 },
  { id: 'heal_5', text: 'Use 5 medkits', target: 5, reward: '60 coins', icon: '💉', check: (p) => (p.totalMedkits || 0) >= 5 },
  { id: 'earn_500', text: 'Earn 500 coins', target: 500, reward: '100 XP', icon: '💰', check: (p) => (p.coins || 0) >= 500 },
  { id: 'kill_runner_3', text: 'Kill 3 Runners', target: 3, reward: '40 coins', icon: '🏃', check: (p) => (p.runnerKills || 0) >= 3 },
  { id: 'open_case_2', text: 'Open 2 cases', target: 2, reward: 'Case', icon: '🎁', check: (p) => (p.casesOpened || 0) >= 2 },
  { id: 'upgrade_bunker', text: 'Upgrade bunker', target: 1, reward: '150 coins', icon: '🏠', check: (p) => (p.bunker?.level || 1) >= 2 },
];

export default function DailyQuests({ player, onAction, onClose }) {
  const [quests, setQuests] = useState([]);
  const [timeLeft, setTimeLeft] = useState('');
  const [claimed, setClaimed] = useState({});

  useEffect(() => {
    const saved = player?.dailyQuests;
    if (saved && saved.date === new Date().toDateString()) {
      setQuests(saved.quests);
      setClaimed(saved.claimed || {});
    } else {
      const shuffled = [...QUESTS].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 3);
      setQuests(selected);
      setClaimed({});
      onAction('saveDailyQuests', { quests: selected, claimed: {}, date: new Date().toDateString() });
    }

    const updateTimer = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = Math.floor((midnight - now) / 1000);
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      setTimeLeft(`${h}h ${m}m`);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, []);

  const claimReward = (quest) => {
    if (claimed[quest.id]) return;
    if (!quest.check(player)) return;
    setClaimed(prev => ({ ...prev, [quest.id]: true }));
    onAction('claimQuest', { questId: quest.id, quest });
  };

  const getProgress = (quest) => {
    switch(quest.id) {
      case 'kill_5': return Math.min(player?.totalKills || 0, 5);
      case 'scout_10': return Math.min(player?.totalExplores || 0, 10);
      case 'collect_100': return Math.min(player?.totalScrap || 0, 100);
      case 'heal_5': return Math.min(player?.totalMedkits || 0, 5);
      case 'earn_500': return Math.min(player?.coins || 0, 500);
      case 'kill_runner_3': return Math.min(player?.runnerKills || 0, 3);
      case 'open_case_2': return Math.min(player?.casesOpened || 0, 2);
      case 'upgrade_bunker': return (player?.bunker?.level || 1) >= 2 ? 1 : 0;
      default: return 0;
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#1a1a0a', border: '3px solid #3a3a1a',
        padding: '25px', width: '550px', position: 'relative'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', background: '#4a1a0a', color: '#ff4444', border: '2px solid #6a2a0a', padding: '8px 12px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>

        <div style={{ fontSize: '18px', fontWeight: '900', color: '#ffaa00', marginBottom: '5px', textAlign: 'center', letterSpacing: '2px' }}>
          📋 DAILY QUESTS
        </div>
        <div style={{ fontSize: '10px', color: '#888', textAlign: 'center', marginBottom: '20px' }}>
          Resets in: {timeLeft}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {quests.map(quest => {
            const progress = getProgress(quest);
            const complete = quest.check(player);
            const isClaimed = claimed[quest.id];

            return (
              <div key={quest.id} style={{
                background: isClaimed ? 'rgba(0,255,136,0.05)' : complete ? 'rgba(255,170,0,0.05)' : '#0a0a05',
                border: isClaimed ? '1px solid #00ff88' : complete ? '1px solid #ffaa00' : '1px solid #3a3a1a',
                padding: '12px', borderRadius: '6px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>{quest.icon}</span>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#ffaa00' }}>{quest.text}</div>
                      <div style={{ fontSize: '8px', color: '#888' }}>Reward: {quest.reward}</div>
                    </div>
                  </div>
                  {isClaimed ? (
                    <span style={{ fontSize: '10px', color: '#00ff88', fontWeight: 'bold' }}>✅ CLAIMED</span>
                  ) : complete ? (
                    <button onClick={() => claimReward(quest)} style={{
                      padding: '6px 12px', background: '#ffaa00', color: '#000', border: 'none',
                      cursor: 'pointer', fontWeight: 'bold', fontSize: '9px', borderRadius: '4px'
                    }}>CLAIM</button>
                  ) : (
                    <span style={{ fontSize: '10px', color: '#888' }}>{progress}/{quest.target}</span>
                  )}
                </div>
                {!isClaimed && (
                  <div style={{ width: '100%', height: '4px', background: '#0a0a05', border: '1px solid #3a3a1a' }}>
                    <div style={{
                      height: '100%', background: complete ? '#ffaa00' : '#888',
                      width: `${Math.min(100, (progress / quest.target) * 100)}%`, transition: '0.3s'
                    }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
