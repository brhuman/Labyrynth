// EndGame.jsx
import { useState, useEffect } from 'react';
import './EndGame.css';
import StatsTable from './StatsTable';

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}

const difficultyNames = {
  easy: 'Лёгкой',
  medium: 'Средней',
  hard: 'Трудной',
};

function EndGame({
  steps,
  time,
  difficulty,
  onGoToStart,
  playerName,
  onChangePlayerName,
  stats,
  onClearStats,
}) {
  const [draftName, setDraftName] = useState(playerName);

  useEffect(() => {
    setDraftName(playerName);
  }, [playerName]);

  function handleSave(e) {
    e?.preventDefault?.();
    const trimmed = draftName.trim();
    onChangePlayerName(trimmed || 'Игрок');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave(e);
    }
  }

  const timeString = formatTime(time);

  return (
    <div className="end-screen">
      <h1 className="end-title">Игра пройдена!</h1>

      <p className="end-text">
        Ты прошёл все уровни на{' '}
        <span className="end-difficulty">{difficultyNames[difficulty]}</span>{' '}
        сложности.
        <br />
        Ходы: <span className="end-steps">{steps}</span> — Время:{' '}
        <span className="end-time">{timeString}</span>
      </p>

      <div className="end-player-name">
        <label className="player-label">
          {/* Имя игрока */}
          <input
            type="text"
            className="player-input"
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </label>

        <button type="button" className="end-btn-save" onClick={handleSave}>
          Сохранить
        </button>
      </div>

      <button type="button" className="end-btn top-btn" onClick={onGoToStart}>
        Новая Игра
      </button>

      {stats && stats.length > 0 && (
        <StatsTable stats={stats} onClearStats={onClearStats} />
      )}
    </div>
  );
}

export default EndGame;
