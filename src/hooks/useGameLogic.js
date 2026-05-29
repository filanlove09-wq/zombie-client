import { useState, useEffect, useCallback } from 'react';

export const useGameLogic = () => {
    const [state, setState] = useState({ 
        player: null, zombie: null, result: '', cdRemaining: 0, isExploring: false, text: '' 
    });

    const call = useCallback(async (url, method = 'GET', body = null) => {
        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: body ? JSON.stringify(body) : null
            });
            const data = await res.json();
            setState(s => ({ 
                ...s, 
                player: data.player, 
                zombie: data.zombie, 
                result: data.result || '', 
                cdRemaining: data.cdRemaining || 0, 
                isExploring: false 
            }));
        } catch (err) {
            console.error('Error:', err);
            setState(s => ({ ...s, isExploring: false }));
        }
    }, []);

    useEffect(() => { call('http://localhost:3000/status'); }, [call]);

    const handleAction = async (type, payload = {}) => {
        if (type === 'explore') setState(s => ({ ...s, isExploring: true }));
        await call('http://localhost:3000/action', 'POST', { type, payload });
    };

    return { state, setState, handleAction };
};