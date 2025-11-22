import './App.css';
import { LEVELS_EASY, LEVELS_MEDIUM, LEVELS_HARD } from './data/levels';
import { TILE_TYPES } from './data/tiles';
import { useState, useEffect } from 'react';
import ActionLogic from './components/ActionLogic';
import EndGame from './components/EndGame'

const LEVEL_SETS = {
  easy: LEVELS_EASY,
  medium: LEVELS_MEDIUM,
  hard: LEVELS_HARD,
};

const difficulty = "easy"; 

const LEVELS = LEVEL_SETS[difficulty];

function findPlayerStart(level) {
  for (let y = 0; y < level.levelStructure.length; y++) {
    const x = level.levelStructure[y].indexOf('P');
    if (x !== -1) return { x, y };
  }
  return null;
}

function cleanLevel(level) {
  return {
    ...level,
    levelStructure: level.levelStructure.map((row) => row.replace('P', '.')),
  };
}

function getVariant(x, y) {
  return (x * 17 + y * 31) % 10;
}

function App() {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
	const [isGameFinished, setIsGameFinished] = useState(false);
  const [level, setLevel] = useState(() => cleanLevel(LEVELS[0]));
  const [playerPos, setPlayerPos] = useState(() => findPlayerStart(LEVELS[0]));
	const [steps, setSteps] = useState(0);
	
  useEffect(() => {
    const rawLevel = LEVELS[currentLevelIndex];
    setLevel(cleanLevel(rawLevel));
    setPlayerPos(findPlayerStart(rawLevel));
  }, [currentLevelIndex]);

	useEffect(() => {
    console.log('Steps:', steps);
  }, [steps]);

  function goToNextLevel() {
		setCurrentLevelIndex((prev) => {
			if (prev + 1 >= LEVELS.length) {
				setIsGameFinished(true); // игра закончена
				return prev; // индекс не увеличиваем
			}
			return prev + 1;
		});
  }

return (
  <>
    {isGameFinished ? (
      <EndGame />
    ) : (
      <>
        <ActionLogic
          level={level}
          playerPos={playerPos}
          setPlayerPos={setPlayerPos}
          onReachExit={goToNextLevel}
          setSteps={setSteps}
        />

        <div className="game_board">
          {level.levelStructure.map((row, rowIndex) => (
            <div className="row" key={rowIndex}>
              {row.split('').map((char, charIndex) => {
                const isPlayer =
                  playerPos &&
                  playerPos.x === charIndex &&
                  playerPos.y === rowIndex;

                const v = getVariant(charIndex, rowIndex);
                const tileClass = isPlayer
                  ? 'cell player'
                  : `cell ${TILE_TYPES[char]} v_${v}`;

                return <span key={charIndex} className={tileClass}></span>;
              })}
            </div>
          ))}
        </div>
      </>
    )}
  </>
);

}

export default App;
