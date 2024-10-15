// src/hooks/useGameTimer.js

import { useState, useEffect, useRef, useCallback } from 'react';
import { TIME_FREEZE_DURATION } from '../constants.js';

export function useGameTimer(initialTime) {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isFrozen, setIsFrozen] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (isFrozen) {
            clearInterval(timerRef.current);
        } else {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => Math.max(prev - 1, 0));
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [isFrozen]);

    const freezeTimer = useCallback(() => {
        setIsFrozen(true);
        setTimeout(() => {
            setIsFrozen(false);
        }, TIME_FREEZE_DURATION * 1000);
    }, []);

    const resetTimer = useCallback(() => {
        setTimeLeft(initialTime);
        setIsFrozen(false);
    }, [initialTime]);

    return { timeLeft, freezeTimer, isFrozen, resetTimer };
}
