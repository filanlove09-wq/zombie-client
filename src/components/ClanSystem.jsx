import React, { useState } from 'react';

export default function ClanSystem({ player, onAction, onClose }) {
  const [clanName, setClanName] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [joinCode, setJoinCode] = useState('');

  const myClan = player?.clan;
  const hasClan = myClan && myClan.name;

  const createClan = () => {
    if (clanName.trim() && (player?.coins || 0) >= 500) {
      onAction('createClan', { name: clanName.trim() });
      setClanName('');
      setShowCreate(false);
    }
  };

  const joinClan = () => {
    if (joinCode.trim()) {
      onAction('joinClan', { name: joinCode.trim() });
      setJoinCode('');
      setShowJoin(false);
    }
  };

  const leaveClan = () => {
    onAction('leaveClan');
  };

  const donateScrap = () => {
    if ((player?.scrap || 0) >= 10) {
      onAction('donateToClan', { amount: 10 });
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#1a1a0a', border: '3px solid #3a3a1a', padding: '25px', width: '500px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', background: '#4a1a0a', color: '#ff4444', border: '2px solid #6a2a0a', padding: '8px 12px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>

        <div style={{ fontSize: '18px', fontWeight: '900', color: '#ffaa00', marginBottom: '20px', textAlign: 'center', letterSpacing: '2px' }}>
          🏰 CLANS
        </div>

        {hasClan ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🛡️</div>
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#ffaa00', marginBottom: '5px' }}>{myClan.name}</div>
            <div style={{ fontSize: '10px', color: '#888', marginBottom: '15px' }}>
              Members: {myClan.members || 1} | Treasury: {myClan.treasury || 0} scrap
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '15px' }}>
              <button onClick={donateScrap} disabled={(player?.scrap || 0) < 10} style={{ padding: '8px 15px', background: '#ffaa00', color: '#000', border: '1px solid #3a3a1a', cursor: 'pointer', fontWeight: 'bold', fontSize: '10px', opacity: (player?.scrap || 0) < 10 ? 0.5 : 1 }}>
                🔧 DONATE 10 SCRAP
              </button>
              <button onClick={leaveClan} style={{ padding: '8px 15px', background: '#ff4444', color: '#fff', border: '1px solid #3a3a1a', cursor: 'pointer', fontWeight: 'bold', fontSize: '10px' }}>
                🚪 LEAVE CLAN
              </button>
            </div>

            <div style={{ fontSize: '9px', color: '#888' }}>
              Invite code: {myClan.name}
            </div>
          </div>
        ) : (
          <div>
            {!showCreate && !showJoin && (
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={() => setShowCreate(true)} style={{ padding: '12px 25px', background: '#ffaa00', color: '#000', border: '2px solid #3a3a1a', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                  🛡️ CREATE CLAN (500💰)
                </button>
                <button onClick={() => setShowJoin(true)} style={{ padding: '12px 25px', background: '#ff6600', color: '#000', border: '2px solid #3a3a1a', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                  🔗 JOIN CLAN
                </button>
              </div>
            )}

            {showCreate && (
              <div style={{ textAlign: 'center' }}>
                <input value={clanName} onChange={(e) => setClanName(e.target.value)} placeholder="Clan name..." style={{ width: '80%', padding: '10px', background: '#0a0a05', border: '1px solid #3a3a1a', color: '#ffaa00', fontFamily: 'monospace', fontSize: '12px', marginBottom: '10px', textAlign: 'center' }} />
                <br />
                <button onClick={createClan} disabled={!clanName.trim() || (player?.coins || 0) < 500} style={{ padding: '10px 20px', background: '#ffaa00', color: '#000', border: '1px solid #3a3a1a', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', marginRight: '10px', opacity: !clanName.trim() || (player?.coins || 0) < 500 ? 0.5 : 1 }}>
                  CREATE (500💰)
                </button>
                <button onClick={() => setShowCreate(false)} style={{ padding: '10px 20px', background: '#1a1a0a', color: '#888', border: '1px solid #3a3a1a', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>
                  CANCEL
                </button>
              </div>
            )}

            {showJoin && (
              <div style={{ textAlign: 'center' }}>
                <input value={joinCode} onChange={(e) => setJoinCode(e.target.value)} placeholder="Clan name to join..." style={{ width: '80%', padding: '10px', background: '#0a0a05', border: '1px solid #3a3a1a', color: '#ffaa00', fontFamily: 'monospace', fontSize: '12px', marginBottom: '10px', textAlign: 'center' }} />
                <br />
                <button onClick={joinClan} disabled={!joinCode.trim()} style={{ padding: '10px 20px', background: '#ff6600', color: '#000', border: '1px solid #3a3a1a', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', marginRight: '10px', opacity: !joinCode.trim() ? 0.5 : 1 }}>
                  JOIN
                </button>
                <button onClick={() => setShowJoin(false)} style={{ padding: '10px 20px', background: '#1a1a0a', color: '#888', border: '1px solid #3a3a1a', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>
                  CANCEL
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
