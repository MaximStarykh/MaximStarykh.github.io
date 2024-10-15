// components/Sound.js

import { useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook to manage sound effects
 * @returns {Object} - Functions to play different sounds
 */
export function useSound() {
    const audioContextRef = useRef(null);

    useEffect(() => {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    const playSound = useCallback((frequency, duration, type = 'sine', gainValue = 1) => {
        const audioContext = audioContextRef.current;
        if (!audioContext) return;

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(gainValue, audioContext.currentTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration - 0.01);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
    }, []);

    return {
        playDiceRoll: () => playSound(300, 0.3, 'triangle'),
        playCorrect: () => playSound(440, 0.2, 'sine'),
        playIncorrect: () => playSound(220, 0.2, 'sawtooth'),
        playBonus: () => playSound(660, 0.3, 'square', 0.7)
    };
}