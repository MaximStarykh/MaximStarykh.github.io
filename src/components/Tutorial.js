// components/Tutorial.js

const { useState, useRef } = React;

/**
 * Tutorial component to display game instructions
 * @param {Object} props
 * @param {function} props.onComplete - Callback when tutorial is completed
 */
function Tutorial({ onComplete }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <h2 className="text-4xl font-bold mb-6 text-[#D52941]">Welcome to Dice Prophet!</h2>
            <p className="mb-6 text-xl">Predict the future, master the dice, and become a legend!</p>
            <div className="space-y-4">
                <p><i className="fas fa-dice text-[#FCD581] mr-2"></i> Guess if the sum will be less or more than 7</p>
                <p><i className="fas fa-chart-line text-[#990D35] mr-2"></i> Build your streak for bigger scores</p>
                <p><i className="fas fa-exclamation-triangle text-[#D52941] mr-2"></i> But beware of the dreaded 7!</p>
            </div>
        </div>,
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <h2 className="text-4xl font-bold mb-6 text-[#D52941]">Power-Ups and Bonuses</h2>
            <div className="space-y-4">
                <p><i className="fas fa-shield-alt text-[#990D35] mr-2"></i> Safe Zone: Protects you from losing your streak</p>
                <p><i className="fas fa-clock text-[#FCD581] mr-2"></i> Time Freeze: Stops the clock for extra gaming time</p>
                <p><i className="fas fa-gift text-[#D52941] mr-2"></i> Look out for surprise bonuses to boost your score!</p>
            </div>
        </div>,
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <h2 className="text-4xl font-bold mb-6 text-[#D52941]">All or Nothing!</h2>
            <p className="mb-6 text-xl">When time runs out, you have one last chance to double your score!</p>
            <div className="space-y-4">
                <p><i className="fas fa-trophy text-[#FCD581] mr-2"></i> Go all-in for a shot at glory</p>
                <p><i className="fas fa-skull-crossbones text-[#990D35] mr-2"></i> But be careful, you could lose it all!</p>
                <p><i className="fas fa-star text-[#D52941] mr-2"></i> Do you have what it takes to be a Dice Prophet?</p>
            </div>
        </div>
    ];

    const handleTouchStart = (e) => {
        touchStartX.current = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        if (touchStartX.current - touchEndX > 50) {
            // Swipe left
            if (currentSlide < slides.length - 1) {
                setCurrentSlide(prev => prev + 1);
            }
        } else if (touchEndX - touchStartX.current > 50) {
            // Swipe right
            if (currentSlide > 0) {
                setCurrentSlide(prev => prev - 1);
            }
        }
    };

    const touchStartX = useRef(0);

    // Button Colors
    const buttonColor = 'bg-[#D52941]';
    const buttonHoverColor = 'hover:bg-[#990D35]';

    return (
        <div
            className="fixed inset-0 bg-gradient-game flex flex-col items-center justify-between z-50"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="flex-grow flex items-center justify-center w-full">
                {slides[currentSlide]}
            </div>
            <div className="w-full px-4 mb-8 flex justify-center">
                {currentSlide === slides.length - 1 ? (
                    <button
                        onClick={onComplete}
                        className={`w-full max-w-md py-4 ${buttonColor} text-white rounded-full ${buttonHoverColor} transition-colors duration-200 font-bold text-2xl`}
                    >
                        Start Game
                    </button>
                ) : (
                    <button
                        onClick={() => setCurrentSlide(prev => prev + 1)}
                        className={`w-full max-w-md py-4 ${buttonColor} text-white rounded-full ${buttonHoverColor} transition-colors duration-200 font-bold text-2xl`}
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    );
}
