import { useEffect } from 'react';

const DIRECTIONS = {
  w: { dx: 0, dy: -1 },
  ц: { dx: 0, dy: -1 },

  s: { dx: 0, dy: 1 },
  ы: { dx: 0, dy: 1 },

  a: { dx: -1, dy: 0 },
  ф: { dx: -1, dy: 0 },

  d: { dx: 1, dy: 0 },
  в: { dx: 1, dy: 0 },
};

function isWall(level, x, y) {
  const row = level.levelStructure[y];
  if (!row) return true;
  return row[x] === '#';
}

function getCell(level, x, y) {
  const row = level.levelStructure[y];
  if (!row) return null;
  return row[x] ?? null;
}

function ActionLogic({
  level,
  playerPos,
  setPlayerPos,
  onReachExit,
  setSteps,
}) {
  useEffect(() => {
    const handleKey = (e) => {
      const key = e.key.toLowerCase();
      const dir = DIRECTIONS[key];
      if (!dir || !playerPos) return;

      e.preventDefault();

      const next = {
        x: playerPos.x + dir.dx,
        y: playerPos.y + dir.dy,
      };

      if (isWall(level, next.x, next.y)) return;

      const cell = getCell(level, next.x, next.y);

      // один шаг = один вызов handleKey
      setSteps((s) => s + 1);

      if (cell === 'E') {
        onReachExit();
      }

      setPlayerPos(next);
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [level, playerPos, setPlayerPos, onReachExit, setSteps]);

  return null;
}

export default ActionLogic;
