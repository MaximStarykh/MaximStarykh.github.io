// utils/gameReducer.js

/**
 * Initial state for the game reducer
 */
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

/**
 * Reducer function to manage game state
 * @param {Object} state - Current state
 * @param {Object} action - Action to perform
 * @returns {Object} - New state
 */
function gameReducer(state, action) {
    switch (action.type) {
        case 'START_GAME':
            return { ...initialState, gameState: 'playing', highScore: state.highScore };
        case 'END_GAME':
            return { ...state, gameState: 'allIn', buttonsDisabled: false };
        case 'GAME_OVER':
            return { ...state, gameState: 'gameOver' };
        case 'ROLL_DICE':
            return {
                ...state,
                dice1: action.dice1,
                dice2: action.dice2,
                rollCount: state.rollCount + 1,
                isRolling: false,
            };
        case 'UPDATE_SCORE':
            return {
                ...state,
                score: action.newScore,
                multiplier: action.multiplier,
                streak: action.isCorrect ? state.streak + 1 : 0,
            };
        case 'ACTIVATE_BONUS':
            return {
                ...state,
                activeBonus: action.bonus,
                safeZoneRolls: action.bonus === 'Safe Zone' ? window.SAFE_ZONE_ROLLS : state.safeZoneRolls,
                isTimeFreezeActive: action.bonus === 'Time Freeze' ? true : state.isTimeFreezeActive,
            };
        case 'DEACTIVATE_BONUS':
            return { ...state, activeBonus: null, safeZoneRolls: 0, isTimeFreezeActive: false };
        case 'UPDATE_HIGH_SCORE':
            return { ...state, highScore: action.highScore };
        case 'SET_ROLLING':
            return { ...state, isRolling: action.isRolling };
        case 'DECREASE_SAFE_ZONE':
            return { ...state, safeZoneRolls: state.safeZoneRolls - 1 };
        case 'DISABLE_BUTTONS':
            return { ...state, buttonsDisabled: true };
        case 'ENABLE_BUTTONS':
            return { ...state, buttonsDisabled: false };
        case 'SHOW_ALLIN_POPUP':
            return { ...state, showAllInPopup: true };
        case 'HIDE_ALLIN_POPUP':
            return { ...state, showAllInPopup: false };
        case 'SHOW_GAME_OVER_SCREEN':
            return { ...state, showGameOverScreen: true };
        default:
            return state;
    }
}

// Assign to global scope
window.gameReducer = gameReducer;
window.initialState = initialState;
