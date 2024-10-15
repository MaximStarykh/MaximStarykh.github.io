// components/Dice.js

import React, { useRef, useEffect } from 'react';

/**
 * Dice component to display a 3D dice
 * @param {Object} props
 * @param {number} props.number - The number to display on the dice
 * @param {boolean} props.rolling - Whether the dice is currently rolling
 * @returns {JSX.Element}
 */
function Dice({ number, rolling }) {
    const diceRef = useRef(null);

    useEffect(() => {
        if (rolling) {
            diceRef.current.classList.add('rolling');
            const timer = setTimeout(() => {
                diceRef.current.classList.remove('rolling');
                setDiceFace(number);
            }, 1250);
            return () => clearTimeout(timer);
        } else {
            setDiceFace(number);
        }
    }, [rolling, number]);

    const setDiceFace = (num) => {
        const transforms = {
            1: 'rotateX(0deg) rotateY(0deg)',
            2: 'rotateX(-90deg) rotateY(0deg)',
            3: 'rotateY(90deg)',
            4: 'rotateY(-90deg)',
            5: 'rotateX(90deg)',
            6: 'rotateX(180deg)',
        };
        diceRef.current.style.transform = transforms[num] || transforms[1];
    };

    return (
        <div className="dice-container">
            <div className="dice" ref={diceRef}>
                <div className="face front"></div>
                <div className="face back"></div>
                <div className="face top"></div>
                <div className="face bottom"></div>
                <div className="face right"></div>
                <div className="face left"></div>
            </div>
        </div>
    );
}

export default Dice;