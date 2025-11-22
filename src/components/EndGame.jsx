// EndGame.jsx
import './EndGame.css';

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}

function EndGame({ steps, time, onGoToStart }) {
  const timeString = formatTime(time);

  return (
    <div className="end-screen">
      <h1 className="end-title">Игра пройдена!</h1>

      <p className="end-text">
        Ты прошёл все уровни за <span className="end-steps">{steps}</span> ходов
        и <span className="end-time">{timeString}</span>.
      </p>

      <button type="button" className="end-btn" onClick={onGoToStart}>
        Вернуться к выбору сложности
      </button>
    </div>
  );
}

export default EndGame;
