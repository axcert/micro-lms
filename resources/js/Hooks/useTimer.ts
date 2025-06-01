import { useState, useEffect, useCallback } from 'react';

export const useTimer = (initialTime: number, onTimeUp?: () => void) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        onTimeUp?.();
                        setIsActive(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft, onTimeUp]);

    const startTimer = useCallback(() => setIsActive(true), []);
    const pauseTimer = useCallback(() => setIsActive(false), []);
    const resetTimer = useCallback(() => {
        setTimeLeft(initialTime);
        setIsActive(false);
    }, [initialTime]);

    const formatTime = useCallback((seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, []);

    return {
        timeLeft,
        isActive,
        startTimer,
        pauseTimer,
        resetTimer,
        formattedTime: formatTime(timeLeft),
    };
};