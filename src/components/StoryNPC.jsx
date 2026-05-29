import React, { useState, useEffect } from 'react';

const DIALOGUES = [
  {
    id: 'intro',
    npc: 'OLD SURVIVOR',
    avatar: '🧓',
    text: 'Welcome to the wasteland, survivor. I have a task for you.',
    quest: { id: 'kill_5_runners', text: 'Kill 5 Runners', reward: '100 coins + Scrap', target: 5 },
    next: 'accepted'
  },
  {
    id: 'accepted',
    npc: 'OLD SURVIVOR',
    avatar: '🧓',
    text: 'Good luck out there. Come back when you are done.',
    quest: null,
    next: null
  },
  {
    id: 'complete',
    npc: 'OLD SURVIVOR',
    avatar: '🧓',
    text: 'Excellent work! The bunker is safer now. Take this reward.',
    quest: null,
    reward: { coins: 100, scrap: 20 },
    next: 'next_quest'
  },
  {
    id: 'next_quest',
    npc: 'OLD SURVIVOR',
    avatar: '🧓',
    text: 'Now I need you to find the lost medallion. It is somewhere in the wasteland...',
    quest: { id: 'find_medallion', text: 'Scout 10 times to find the medallion', reward: '200 coins + Case', target: 10 },
    next: null
  }
];

export default function StoryNPC({ player, onAction, onClose }) {
  const [currentDialogue, setCurrentDialogue] = useState('intro');
  const [storyProgress, setStoryProgress] = useState(player?.storyProgress || {});
  const [questProgress, setQuestProgress] = useState(0);

  const dialogue = DIALOGUES.find(d => d.id === currentDialogue);

  useEffect(() => {
    // Проверяем выполнение квеста
    if (storyProgress.activeQuest === 'kill_5_runners') {
      setQuestProgress(player?.runnerKills || 0);
      if ((player?.runnerKills || 0) >= 5 && currentDialogue === 'accepted') {
        setCurrentDialogue('complete');
      }
    }
    if (storyProgress.activeQuest === 'find_medallion') {
      setQuestProgress(player?.totalExplores || 0);
      if ((player?.totalExplores || 0) >= 10 && currentDialogue === 'next_quest') {
        // Можно добавить завершение
      }
    }
  }, [player, storyProgress, currentDialogue]);

  const handleNext = () => {
    if (dialogue?.quest) {
      // Принимаем квест
      setStoryProgress(prev => ({ ...prev, activeQuest: dialogue.quest.id }));
      onAction('acceptQuest', { questId: dialogue.quest.id });
    }
    if (dialogue?.reward) {
      // Забираем награду
      onAction('claimStoryReward', { reward: dialogue.reward });
      setStoryProgress(prev => ({ ...prev, activeQuest: null, completed: [...(prev.completed || []), prev.activeQuest] }));
    }
    if (dialogue?.next) {
      setCurrentDialogue(dialogue.next);
    } else if (dialogue?.quest) {
      setCurrentDialogue('accepted');
    }
  };

  const getProgressText = () => {
    if (!storyProgress.activeQuest) return '';
    const quest = DIALOGUES.find(d => d.quest?.id === storyProgress.activeQuest);
    if (!quest?.quest) return '';
    return `${questProgress}/${quest.quest.target}`;
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#1a1a0a', border: '3px solid #3a3a1a',
        padding: '30px', width: '500px', position: 'relative', textAlign: 'center'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', background: '#4a1a0a', color: '#ff4444', border: '2px solid #6a2a0a', padding: '8px 12px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>

        <div style={{ fontSize: '50px', marginBottom: '15px' }}>{dialogue?.avatar}</div>
        <div style={{ fontSize: '14px', fontWeight: '900', color: '#ffaa00', letterSpacing: '2px', marginBottom: '15px' }}>
          {dialogue?.npc}
        </div>
        <div style={{ fontSize: '12px', color: '#ccc', lineHeight: '1.6', marginBottom: '20px', minHeight: '60px' }}>
          {dialogue?.text}
        </div>

        {dialogue?.quest && (
          <div style={{ background: '#0a0a05', border: '1px solid #3a3a1a', padding: '10px', marginBottom: '15px', borderRadius: '6px' }}>
            <div style={{ fontSize: '10px', color: '#ffaa00', fontWeight: 'bold' }}>📋 QUEST: {dialogue.quest.text}</div>
            <div style={{ fontSize: '9px', color: '#888', marginTop: '4px' }}>Reward: {dialogue.quest.reward}</div>
          </div>
        )}

        {storyProgress.activeQuest && (
          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontSize: '9px', color: '#888', marginBottom: '4px' }}>Progress: {getProgressText()}</div>
            <div style={{ width: '100%', height: '4px', background: '#0a0a05', border: '1px solid #3a3a1a' }}>
              <div style={{ height: '100%', background: '#ffaa00', width: `${Math.min(100, (questProgress / (dialogue?.quest?.target || 1)) * 100)}%` }} />
            </div>
          </div>
        )}

        <button onClick={handleNext} style={{
          padding: '12px 40px', background: '#ffaa00', color: '#000', border: '2px solid #3a3a1a',
          fontWeight: '900', cursor: 'pointer', fontSize: '13px', letterSpacing: '2px', fontFamily: "'Courier New', monospace"
        }}>
          {dialogue?.quest ? 'ACCEPT QUEST' : dialogue?.reward ? 'CLAIM REWARD' : 'CONTINUE'}
        </button>
      </div>
    </div>
  );
}