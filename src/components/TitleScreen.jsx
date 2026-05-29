import React, { useState } from 'react';

export default function TitleScreen({ onStart }) {
  const [showCredits, setShowCredits] = useState(false);

  return (
    <div style={{
      height: '100vh',
      background: 'linear-gradient(180deg, #0a0a05 0%, #1a1a0a 50%, #0a0a05 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Courier New', monospace",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* DECORATIVE ELEMENTS */}
      <div style={{ position: 'absolute', top: '10%', left: '10%', fontSize: '60px', opacity: 0.1 }}>☢️</div>
      <div style={{ position: 'absolute', bottom: '15%', right: '10%', fontSize: '80px', opacity: 0.1 }}>🧟</div>
      <div style={{ position: 'absolute', top: '20%', right: '20%', fontSize: '40px', opacity: 0.08 }}>⚠️</div>
      <div style={{ position: 'absolute', bottom: '25%', left: '15%', fontSize: '50px', opacity: 0.08 }}>💀</div>

      {/* SCAN LINES EFFECT */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 2px, transparent 2px, transparent 4px)',
        pointerEvents: 'none'
      }} />

      {/* MAIN CONTENT */}
      <div style={{ zIndex: 1, textAlign: 'center' }}>
        {/* TITLE */}
        <div style={{
          fontSize: '52px', fontWeight: '900', color: '#ffaa00',
          letterSpacing: '8px', marginBottom: '5px',
          textShadow: '0 0 30px rgba(255,170,0,0.5), 0 0 60px rgba(255,170,0,0.3)'
        }}>
          ZOMBIE
        </div>
        <div style={{
          fontSize: '36px', fontWeight: '900', color: '#ff6600',
          letterSpacing: '6px', marginBottom: '15px',
          textShadow: '0 0 20px rgba(255,100,0,0.5)'
        }}>
          BUNKER
        </div>

        {/* SUBTITLE */}
        <div style={{
          fontSize: '12px', color: '#888', letterSpacing: '4px', marginBottom: '60px',
          border: '1px solid #3a3a1a', display: 'inline-block', padding: '8px 20px'
        }}>
          SURVIVE • LOOT • UPGRADE
        </div>

        {/* PLAY BUTTON */}
        <div style={{ marginBottom: '30px' }}>
          <button onClick={onStart} style={{
            padding: '18px 60px',
            background: 'linear-gradient(180deg, #ffaa00, #cc8800)',
            color: '#000',
            border: '3px solid #ffcc00',
            fontSize: '20px',
            fontWeight: '900',
            letterSpacing: '4px',
            cursor: 'pointer',
            fontFamily: "'Courier New', monospace",
            boxShadow: '0 0 40px rgba(255,170,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
            transition: 'all 0.3s',
            textTransform: 'uppercase'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 0 60px rgba(255,170,0,0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 0 40px rgba(255,170,0,0.4)';
          }}>
            ▶ PLAY
          </button>
        </div>

        {/* BOTTOM BUTTONS */}
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button onClick={() => setShowCredits(!showCredits)} style={{
            padding: '10px 25px',
            background: 'transparent',
            color: '#888',
            border: '1px solid #3a3a1a',
            fontSize: '11px',
            fontWeight: 'bold',
            letterSpacing: '2px',
            cursor: 'pointer',
            fontFamily: "'Courier New', monospace"
          }}>
            CREDITS
          </button>
        </div>

        {/* CREDITS */}
        {showCredits && (
          <div style={{
            marginTop: '30px',
            padding: '20px',
            background: 'rgba(0,0,0,0.8)',
            border: '1px solid #3a3a1a',
            borderRadius: '4px',
            maxWidth: '400px'
          }}>
            <div style={{ fontSize: '14px', color: '#ffaa00', fontWeight: 'bold', marginBottom: '15px', letterSpacing: '2px' }}>
              CREDITS
            </div>
            <div style={{ fontSize: '10px', color: '#888', lineHeight: '2' }}>
              <div>🎮 Game by: Survivor</div>
              <div>🎨 Art: AI Generated</div>
              <div>💻 Engine: React + Node.js</div>
              <div style={{ marginTop: '10px', color: '#ffaa00' }}>🔥 Special thanks to all zombies</div>
              <div style={{ color: '#666' }}>who died for this game</div>
            </div>
          </div>
        )}

        {/* VERSION */}
        <div style={{ position: 'absolute', bottom: '20px', right: '30px', fontSize: '9px', color: '#444', letterSpacing: '2px' }}>
          v2.0 // WASTELAND EDITION
        </div>
      </div>
    </div>
  );
}