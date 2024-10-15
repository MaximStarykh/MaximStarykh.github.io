// src/components/DiceProphet.js

import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { useSound } from '../hooks/useSound.js';
import { useGameTimer } from '../hooks/useGameTimer.js';
import Tutorial from './Tutorial.js';
import Dice from './Dice.js';
import {
    BASE_POINTS,
    BONUS_ACTIVATION_ROLLS,
    BONUS_ACTIVATION_CHANCE,
    BONUS_TYPE_CHANCE,
    SAFE_ZONE_ROLLS,
    TIME_FREEZE_DURATION,
    MAX_MULTIPLIER,
    INITIAL_TIME
} from '../constants.js';

const tg = window.Telegram.WebApp;

// Initial game state
const initialState = {
    dice1: 1,
    dice2: 1,
    score: 0,
    highScore: 0,
    multiplier: 1,
    activeBonus: null,
    gameState: 'ready',
    safeZoneRolls: 0,
    rollCount: 0,
    isRolling: false,
    streak: 0,
    isTimeFreezeActive: false,
    buttonsDisabled: false,
    showAllInPopup: false,
    showGameOverScreen: false,
};

// Game reducer function
function gameReducer(state, action) {
    switch (action.type) {
        // Start the game
        case 'START_GAME':
            return { ...initialState, gameState: 'playing', highScore: state.highScore };

        // Transition to all-in round
        case 'END_GAME':
            return { ...state, gameState: 'allIn', buttonsDisabled: false };

        // Game over state
        case 'GAME_OVER':
            return {
                ...state,
                gameState: 'gameOver',
                activeBonus: null,
                safeZoneRolls: 0,
                isTimeFreezeActive: false,
            };

        // Roll dice action
        case 'ROLL_DICE':
            return {
                ...state,
                dice1: action.dice1,
                dice2: action.dice2,
                rollCount: state.rollCount + 1,
                isRolling: false,
            };

        // Update score and multiplier
        case 'UPDATE_SCORE':
            return {
                ...state,
                score: action.newScore,
                multiplier: action.multiplier,
                streak: action.isCorrect ? state.streak + 1 : 0,
            };

        // Activate bonus
        case 'ACTIVATE_BONUS':
            return {
                ...state,
                activeBonus: action.bonus,
                safeZoneRolls: action.bonus === 'Safe Zone' ? SAFE_ZONE_ROLLS : state.safeZoneRolls,
                isTimeFreezeActive: action.bonus === 'Time Freeze' ? true : state.isTimeFreezeActive,
            };

        // Deactivate bonus
        case 'DEACTIVATE_BONUS':
            return { ...state, activeBonus: null, safeZoneRolls: 0, isTimeFreezeActive: false };

        // Update high score
        case 'UPDATE_HIGH_SCORE':
            return { ...state, highScore: action.highScore };

        // Set rolling state
        case 'SET_ROLLING':
            return { ...state, isRolling: action.isRolling };

        // Decrease safe zone rolls
        case 'DECREASE_SAFE_ZONE':
            return { ...state, safeZoneRolls: state.safeZoneRolls - 1 };

        // Disable buttons
        case 'DISABLE_BUTTONS':
            return { ...state, buttonsDisabled: true };

        // Enable buttons
        case 'ENABLE_BUTTONS':
            return { ...state, buttonsDisabled: false };

        // Show all-in popup
        case 'SHOW_ALLIN_POPUP':
            return { ...state, showAllInPopup: true };

        // Hide all-in popup
        case 'HIDE_ALLIN_POPUP':
            return { ...state, showAllInPopup: false };

        // Show game over screen
        case 'SHOW_GAME_OVER_SCREEN':
            return { ...state, showGameOverScreen: true };

        default:
            return state;
    }
}

// Main game component
function DiceProphet() {
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const { timeLeft, freezeTimer, isFrozen, resetTimer } = useGameTimer(INITIAL_TIME);
    const { playDiceRoll, playCorrect, playIncorrect, playBonus } = useSound();
    const [showTutorial, setShowTutorial] = useState(true);

    useEffect(() => {
        // Initialize Telegram WebApp
        tg.ready();
        tg.expand();

        // Fetch high score from cloud storage
        const fetchHighScore = async () => {
            try {
                const value = await new Promise((resolve, reject) => {
                    tg.CloudStorage.getItem("highScore", (error, value) => {
                        if (error) reject(error);
                        else resolve(value);
                    });
                });
                if (value) {
                    dispatch({ type: 'UPDATE_HIGH_SCORE', highScore: parseInt(value) });
                }
            } catch (error) {
                console.error("Failed to retrieve high score:", error);
                dispatch({ type: 'UPDATE_HIGH_SCORE', highScore: 0 });
            }
        };

        fetchHighScore();
    }, []);

    useEffect(() => {
        // Handle timer reaching zero
        if (timeLeft === 0 && state.gameState === 'playing') {
            dispatch({ type: 'DISABLE_BUTTONS' });
            dispatch({ type: 'SHOW_ALLIN_POPUP' });
            setTimeout(() => {
                dispatch({ type: 'HIDE_ALLIN_POPUP' });
                dispatch({ type: 'END_GAME' });
            }, 2000); // Show popup for 2 seconds
        }
    }, [timeLeft, state.gameState]);

    useEffect(() => {
        // Handle time freeze bonus
        if (state.isTimeFreezeActive) {
            freezeTimer();
            setTimeout(() => {
                dispatch({ type: 'DEACTIVATE_BONUS' });
            }, TIME_FREEZE_DURATION * 1000);
        }
    }, [state.isTimeFreezeActive, freezeTimer]);

    useEffect(() => {
        // Update high score on game over
        if (state.gameState === 'gameOver') {
            if (state.score > state.highScore) {
                dispatch({ type: 'UPDATE_HIGH_SCORE', highScore: state.score });
                saveHighScore(state.score);
            }
        }
    }, [state.gameState, state.score, state.highScore]);

    useEffect(() => {
        // Show game over screen after a delay
        if (state.gameState === 'gameOver' && !state.showGameOverScreen) {
            const timeout = setTimeout(() => {
                dispatch({ type: 'SHOW_GAME_OVER_SCREEN' });
            }, 2000);

            return () => clearTimeout(timeout);
        }
    }, [state.gameState, state.showGameOverScreen]);

    // Function to save high score
    const saveHighScore = useCallback(async (score) => {
        try {
            await new Promise((resolve, reject) => {
                tg.CloudStorage.setItem("highScore", score.toString(), (error) => {
                    if (error) reject(error);
                    else resolve();
                });
            });
        } catch (error) {
            console.error("Failed to save high score:", error);
        }
    }, []);

    // Function to start the game
    const startGame = useCallback(() => {
        setShowTutorial(false);
        resetTimer();
        dispatch({ type: 'START_GAME' });
    }, [resetTimer]);

    // Function to roll the dice
    const rollDice = useCallback(() => {
        dispatch({ type: 'SET_ROLLING', isRolling: true });
        playDiceRoll();
        tg.HapticFeedback.impactOccurred('medium');
        return new Promise(resolve => {
            setTimeout(() => {
                const newDice1 = Math.floor(Math.random() * 6) + 1;
                const newDice2 = Math.floor(Math.random() * 6) + 1;
                dispatch({ type: 'ROLL_DICE', dice1: newDice1, dice2: newDice2 });
                resolve({ dice1: newDice1, dice2: newDice2 });
            }, 1250); // Match the dice animation duration
        });
    }, [playDiceRoll]);

    // Function to process user's prediction
    const processPrediction = useCallback(async (pred, isAllIn = false) => {
        // Disable input if buttons are disabled or dice are rolling
        if (state.buttonsDisabled || state.isRolling) return;

        const { dice1, dice2 } = await rollDice();
        const sum = dice1 + dice2;
        const isCorrect = (pred === 'less' && sum < 7) || (pred === 'more' && sum > 7);
        let newScore = state.score;
        let newMultiplier = state.streak + 1;

        if (isCorrect) {
            if (isAllIn) {
                newScore *= 2;
            } else {
                newScore += BASE_POINTS * newMultiplier;
            }
            playCorrect();
            tg.HapticFeedback.notificationOccurred('success');
        } else {
            if (isAllIn) {
                newScore = 0;
            } else {
                if (sum === 7) {
                    newScore = 0;
                    newMultiplier = 1;
                } else {
                    newMultiplier = 1;
                }
            }
            playIncorrect();
            tg.HapticFeedback.notificationOccurred('error');
        }

        if (state.activeBonus === 'Safe Zone' && !isAllIn) {
            dispatch({ type: 'DECREASE_SAFE_ZONE' });
            if (state.safeZoneRolls <= 1) {
                dispatch({ type: 'DEACTIVATE_BONUS' });
            }
        } else if (!isCorrect && !isAllIn) {
            dispatch({ type: 'DEACTIVATE_BONUS' });
        }

        dispatch({
            type: 'UPDATE_SCORE',
            newScore: newScore,
            multiplier: newMultiplier,
            isCorrect: isCorrect,
        });

        if (!isAllIn && (state.rollCount + 1) % BONUS_ACTIVATION_ROLLS === 0 && !state.activeBonus) {
            const bonusChance = Math.random();
            if (bonusChance < BONUS_ACTIVATION_CHANCE) {
                const bonusTypeChance = Math.random();
                if (bonusTypeChance < BONUS_TYPE_CHANCE) {
                    dispatch({ type: 'ACTIVATE_BONUS', bonus: 'Safe Zone' });
                    playBonus();
                } else {
                    dispatch({ type: 'ACTIVATE_BONUS', bonus: 'Time Freeze' });
                    playBonus();
                }
            }
        }

        if (isAllIn) {
            // Wait for 2 seconds to show the dice result before game over
            setTimeout(() => {
                dispatch({ type: 'GAME_OVER' });
            }, 2000);
        }
    }, [state, rollDice, playCorrect, playIncorrect, playBonus]);

    // Function to render the game content based on the game state
    const renderGameContent = () => {
        if (state.gameState === 'gameOver' && !state.showGameOverScreen) {
            // Show the last game state during the 2-second pause
            return (
                <div className="flex flex-col items-center justify-between h-screen bg-gradient-game text-black p-4">
                    {/* Display the last game state without interactions */}
                    {renderGame()}
                </div>
            );
        }

        switch (state.gameState) {
            case 'ready':
                return (
                    <div className="text-center">
                        <button
                            onClick={startGame}
                            className="w-4/5 max-w-md px-8 py-4 bg-[#FCD581] text-[#990D35] rounded-full transition-colors duration-200 text-2xl font-bold shadow-lg"
                        >
                            Start Game
                        </button>
                    </div>
                );
            case 'playing':
            case 'allIn':
                return renderGame();
            case 'gameOver':
                return (
                    <div className="text-center space-y-6">
                        <div className="text-5xl font-bold mb-6 text-[#D52941] fade-in">Game Over!</div>
                        <div className="text-4xl mb-4 fade-in">Final Score: {Math.floor(state.score)}</div>
                        <div className="text-3xl mb-6 fade-in">High Score: {Math.floor(state.highScore)}</div>
                        <button
                            onClick={startGame}
                            className="w-4/5 max-w-md px-8 py-4 bg-[#D52941] text-white rounded-full text-2xl font-bold shadow-lg"
                        >
                            Play Again
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    // Function to render the main game UI
    const renderGame = () => (
        <div className="flex flex-col items-center justify-between h-screen bg-gradient-game text-black p-4">
            {/* Score and Timer */}
            <div className="w-full max-w-md">
                <div className="bg-white bg-opacity-20 rounded-2xl p-4 mb-4 relative overflow-hidden shadow-custom">
                    <div className="flex flex-col items-center mb-2">
                        <p className="text-sm opacity-70">Score</p>
                        <p className="text-5xl font-bold">
                            {Math.floor(state.score)} {state.activeBonus === 'Safe Zone' && '🛡️'}
                        </p>
                    </div>
                    <div
                        className={`flex items-center justify-center bg-white bg-opacity-30 rounded-xl py-2 ${
                            state.isTimeFreezeActive ? 'frozen' : ''
                        } shadow-custom`}
                    >
                        <i className="far fa-clock mr-2"></i>
                        <p className="text-2xl font-semibold">{timeLeft}s {state.isTimeFreezeActive && '❄️'}</p>
                    </div>
                </div>
                <div className="flex justify-center items-center space-x-2 mb-4">
                    <div className="bg-white bg-opacity-20 rounded-xl py-1 px-3 flex items-center shadow-custom">
                        <i className="fas fa-bolt mr-1"></i>
                        <span className="font-semibold">
                            Streak: {state.streak} {state.activeBonus === 'Safe Zone' && '🛡️'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Dice */}
            <div className="flex justify-center items-center space-x-8 my-8">
                <Dice number={state.dice1} rolling={state.isRolling} />
                <Dice number={state.dice2} rolling={state.isRolling} />
            </div>

            {/* Prediction Buttons */}
            <div className="w-full flex flex-col items-center space-y-4 mb-8">
                <button
                    className={`w-full max-w-md py-4 ${
                        state.gameState === 'allIn' ? 'bg-[#FCD581]' : 'bg-green-500'
                    } text-white font-bold rounded-xl flex items-center justify-center transition-colors duration-150 shadow-custom ${
                        (state.isRolling || state.buttonsDisabled) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => processPrediction('less', state.gameState === 'allIn')}
                    disabled={state.isRolling || state.buttonsDisabled}
                >
                    <i className="fas fa-arrow-down mr-2"></i> {state.gameState === 'allIn' ? 'All-In: Less than 7' : 'Less than 7'}
                </button>
                <button
                    className={`w-full max-w-md py-4 ${
                        state.gameState === 'allIn' ? 'bg-[#FCD581]' : 'bg-red-500'
                    } text-white font-bold rounded-xl flex items-center justify-center transition-colors duration-150 shadow-custom ${
                        (state.isRolling || state.buttonsDisabled) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => processPrediction('more', state.gameState === 'allIn')}
                    disabled={state.isRolling || state.buttonsDisabled}
                >
                    <i className="fas fa-arrow-up mr-2"></i> {state.gameState === 'allIn' ? 'All-In: More than 7' : 'More than 7'}
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            {showTutorial && <Tutorial onComplete={startGame} />}
            {renderGameContent()}
            {state.showAllInPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 text-center all-in-popup shadow-custom">
                        <h2 className="text-3xl font-bold text-[#D52941]">All-In Round!</h2>
                        <p className="mt-4 text-xl">Double or Nothing!</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DiceProphet;
