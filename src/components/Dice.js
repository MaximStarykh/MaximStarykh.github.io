// components/Dice.js

const { useRef, useEffect } = React;

/**
 * Dice component to display a 3D dice
 * @param {Object} props
 * @param {number} props.number - The number to display on the dice
 * @param {boolean} props.rolling - Whether the dice is currently rolling
 */
function Dice({ number, rolling }) {
    const diceRef = useRef(null);

    useEffect(() => {
        if (rolling) {
            diceRef.current.classList.add('rolling');
            setTimeout(() => {
                diceRef.current.classList.remove('rolling');
                setDiceFace(number);
            }, 1250);
        } else {
            setDiceFace(number);
        }
    }, [rolling, number]);

    const setDiceFace = (num) => {
        let transform = '';
        switch (num) {
            case 1:
                transform = 'rotateX(0deg) rotateY(0deg)';
                break;
            case 2:
                transform = 'rotateX(-90deg) rotateY(0deg)';
                break;
            case 3:
                transform = 'rotateY(90deg)';
                break;
            case 4:
                transform = 'rotateY(-90deg)';
                break;
            case 5:
                transform = 'rotateX(90deg)';
                break;
            case 6:
                transform = 'rotateX(180deg)';
                break;
            default:
                transform = 'rotateX(0deg) rotateY(0deg)';
                break;
        }
        diceRef.current.style.transform = transform;
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
