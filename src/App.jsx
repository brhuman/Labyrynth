import './App.css';
import { LEVELS_EASY, LEVELS_MEDIUM, LEVELS_HARD } from './data/levels';
import { TILE_TYPES } from './data/tiles';
import { useState, useEffect } from 'react';
import ActionLogic from './components/ActionLogic';
import EndGame from './components/EndGame';
import StartGame from './components/StartGame';

const LEVEL_SETS = {
  easy: LEVELS_EASY,
  medium: LEVELS_MEDIUM,
  hard: LEVELS_HARD,
};

const STATS_STORAGE_KEY = 'maze_stats_v1';

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

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}

function getVariant(x, y) {
  return (x * 17 + y * 31) % 10;
}

function App() {
  const [difficulty, setDifficulty] = useState('easy');
  const LEVELS = LEVEL_SETS[difficulty];

  const [showStartScreen, setShowStartScreen] = useState(true);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [level, setLevel] = useState(() => cleanLevel(LEVELS[0]));
  const [playerPos, setPlayerPos] = useState(() => findPlayerStart(LEVELS[0]));
  const [steps, setSteps] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [playerName, setPlayerName] = useState('Игрок');

  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem(STATS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // флаг, чтобы не сохранять результат несколько раз
  const [resultSaved, setResultSaved] = useState(false);

  // сохраняем статистику в localStorage
  useEffect(() => {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    const rawLevel = LEVELS[currentLevelIndex];
    setLevel(cleanLevel(rawLevel));
    setPlayerPos(findPlayerStart(rawLevel));
  }, [currentLevelIndex, difficulty]);

  useEffect(() => {
    if (showStartScreen || isGameFinished) return;

    const id = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(id);
  }, [showStartScreen, isGameFinished]);

  // добавляем запись ОДИН раз, когда игра закончилась
  useEffect(() => {
    if (!isGameFinished || resultSaved) return;

    setStats((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: playerName,
        difficulty,
        steps,
        time: elapsedSeconds,
      },
    ]);
    setResultSaved(true);
  }, [isGameFinished, resultSaved]); // 👈 только эти зависимости

  function goToNextLevel() {
    setCurrentLevelIndex((prev) => {
      if (prev + 1 >= LEVELS.length) {
        setIsGameFinished(true);
        return prev;
      }
      return prev + 1;
    });
  }

  function resetRunState() {
    setCurrentLevelIndex(0);
    setSteps(0);
    setElapsedSeconds(0);
    const rawLevel = LEVELS[0];
    setLevel(cleanLevel(rawLevel));
    setPlayerPos(findPlayerStart(rawLevel));
  }

  function handleStartNewGame() {
    setIsGameFinished(false);
    setResultSaved(false);
    resetRunState();
    setShowStartScreen(false);
  }

  function handleChangeDifficulty(newDifficulty) {
    setDifficulty(newDifficulty);
    setIsGameFinished(false);
    setResultSaved(false);
    const firstLevel = LEVEL_SETS[newDifficulty][0];
    setLevel(cleanLevel(firstLevel));
    setPlayerPos(findPlayerStart(firstLevel));
    setCurrentLevelIndex(0);
    setSteps(0);
    setElapsedSeconds(0);
  }

  function handleGoToStart() {
    setIsGameFinished(false);
    setResultSaved(false);
    resetRunState();
    setShowStartScreen(true);
  }

  // 🔹 меняем имя И обновляем последнюю запись в статистике
  function handleChangePlayerName(newName) {
    setPlayerName(newName);

    setStats((prev) => {
      if (!prev.length) return prev;
      const updated = [...prev];
      const lastIndex = updated.length - 1;
      updated[lastIndex] = {
        ...updated[lastIndex],
        name: newName,
      };
      return updated;
    });
  }

  // 🔹 очистка статистики
  function handleClearStats() {
    setStats([]);
    localStorage.removeItem(STATS_STORAGE_KEY);
  }

  if (showStartScreen) {
    return (
      <StartGame
        difficulty={difficulty}
        onChangeDifficulty={handleChangeDifficulty}
        onNewGame={handleStartNewGame}
      />
    );
  }

  return (
    <>
      {isGameFinished ? (
        <EndGame
          steps={steps}
          time={elapsedSeconds}
          difficulty={difficulty}
          onGoToStart={handleGoToStart}
          playerName={playerName}
          onChangePlayerName={handleChangePlayerName}
          stats={stats}
          onClearStats={handleClearStats}
        />
      ) : (
        <>
          <ActionLogic
            level={level}
            playerPos={playerPos}
            setPlayerPos={setPlayerPos}
            onReachExit={goToNextLevel}
            setSteps={setSteps}
          />

          <div className="hud">
            <div className="steps-counter">
              Ходы: <span>{steps}</span>
            </div>
            <div className="time-counter">
              Время: <span>{formatTime(elapsedSeconds)}</span>
            </div>
          </div>

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
