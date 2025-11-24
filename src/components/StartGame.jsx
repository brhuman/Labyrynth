import './StartGame.css';

function StartGame({ difficulty, onChangeDifficulty, onNewGame }) {
  const difficulties = [
    { id: 'easy', label: 'Лёгкий' },
    { id: 'medium', label: 'Средний' },
    { id: 'hard', label: 'Сложный' },
  ];

  return (
    <div className="start-screen">
      <h1>Labyrynth Game</h1>
      <p>Выбери сложность и нажми «Новая игра»</p>

      <div className="difficulty-tabs">
        {difficulties.map((d) => (
          <button
            key={d.id}
            type="button"
            className={
              'difficulty-tab' + (difficulty === d.id ? ' active' : '')
            }
            onClick={() => onChangeDifficulty(d.id)}
          >
            {d.label}
          </button>
        ))}
      </div>

      <button type="button" className="new-game-btn" onClick={onNewGame}>
        Новая игра
      </button>
    </div>
  );
}

export default StartGame;
