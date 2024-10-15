// components/Tutorial.js

import React, { useState, useRef } from 'react';

/**
 * Tutorial component to display game instructions
 * @param {Object} props
 * @param {function} props.onComplete - Callback when tutorial is completed
 * @returns {JSX.Element}
 */
function Tutorial({ onComplete }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const touchStartX = useRef(0);

    const slides = [
        {
            title: "Welcome to Dice Prophet!",
            content: [
                { icon: "fas fa-dice", text: "Guess if the sum will be less or more than 7" },
                { icon: "fas fa-chart-line", text: "Build your streak for bigger scores" },
                { icon: "fas fa-exclamation-triangle", text: "But beware of the dreaded 7!" },
            ],
        },
        {
            title: "Power-Ups and Bonuses",
            content: [
                { icon: "fas fa-shield-alt", text: "Safe Zone: Protects you from losing your streak" },
                { icon: "fas fa-clock", text: "Time Freeze: Stops the clock for extra gaming time" },
                { icon: "fas fa-gift", text: "Look out for surprise bonuses to boost your score!" },
            ],
        },
        {
            title: "All or Nothing!",
            content: [
                { icon: "fas fa-trophy", text: "Go all-in for a shot at glory" },
                { icon: "fas fa-skull-crossbones", text: "But be careful, you could lose it all!" },
                { icon: "fas fa-star", text: "Do you have what it takes to be a Dice Prophet?" },
            ],
        },
    ];

    const handleTouchStart = (e) => {
        touchStartX.current = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const difference = touchStartX.current - touchEndX;

        if (Math.abs(difference) > 50) {
            if (difference > 0 && currentSlide < slides.length - 1) {
                setCurrentSlide(prev => prev + 1);
            } else if (difference < 0 && currentSlide > 0) {
                setCurrentSlide(prev => prev - 1);
            }
        }
    };

    const renderSlide = (slide) => (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <h2 className="text-4xl font-bold mb-6 text-[#D52941]">{slide.title}</h2>
            <div className="space-y-4">
                {slide.content.map((item, index) => (
                    <p key={index}>
                        <i className={`${item.icon} text-[#FCD581] mr-2`}></i> {item.text}
                    </p>
                ))}
            </div>
        </div>
    );

    return (
        <div
            className="fixed inset-0 bg-gradient-game flex flex-col items-center justify-between z-50"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="flex-grow flex items-center justify-center w-full">
                {renderSlide(slides[currentSlide])}
            </div>
            <div className="w-full px-4 mb-8 flex justify-center">
                {currentSlide === slides.length - 1 ? (
                    <button
                        onClick={onComplete}
                        className="w-full max-w-md py-4 bg-[#D52941] text-white rounded-full hover:bg-[#990D35] transition-colors duration-200 font-bold text-2xl"
                    >
                        Start Game
                    </button>
                ) : (
                    <button
                        onClick={() => setCurrentSlide(prev => prev + 1)}
                        className="w-full max-w-md py-4 bg-[#D52941] text-white rounded-full hover:bg-[#990D35] transition-colors duration-200 font-bold text-2xl"
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    );
}

export default Tutorial;