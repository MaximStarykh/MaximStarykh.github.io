// components/Sound.js

const { useRef, useEffect, useCallback } = React;

/**
 * Custom hook to manage sound effects
 * @returns {Object} - Functions to play different sounds
 */
function useSound() {
    const audioContextRef = useRef(null);

    useEffect(() => {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }, []);

    const playSound = useCallback((frequency, duration) => {
        const audioContext = audioContextRef.current;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration - 0.01);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
    }, []);

    return {
        playDiceRoll: () => playSound(300, 0.3),
        playCorrect: () => playSound(440, 0.2),
        playIncorrect: () => playSound(220, 0.2),
        playBonus: () => playSound(660, 0.3)
    };
}

// Assign to global scope
window.useSound = useSound;
