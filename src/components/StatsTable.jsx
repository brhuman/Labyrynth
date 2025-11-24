import { useMemo, useState } from 'react';
import './StatsTable.css';

const difficultyNames = {
	easy: 'Лёгкая',
	medium: 'Средняя',
	hard: 'Трудная',
};

function formatTime(totalSeconds) {
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	return `${minutes.toString().padStart(2, '0')}:${seconds
		.toString()
		.padStart(2, '0')}`;
}

const SORTS = {
	DIFFICULTY: 'difficulty',
	TIME: 'time',
	STEPS: 'steps',
};

function difficultyWeight(diff) {
	if (diff === 'easy') return 1;
	if (diff === 'medium') return 2;
	if (diff === 'hard') return 3;
	return 99;
}

function StatsTable({ stats }) {
	const [sortBy, setSortBy] = useState(SORTS.TIME);
	const [sortDir, setSortDir] = useState('asc'); // asc / desc

	function handleSortChange(newSortBy) {
		setSortBy((prev) => {
			if (prev === newSortBy) {
				// если клик по тому же — меняем направление
				setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
				return prev;
			}
			setSortDir('asc');
			return newSortBy;
		});
	}

	const sorted = useMemo(() => {
		const arr = [...stats];

		arr.sort((a, b) => {
			let valueA;
			let valueB;

			if (sortBy === SORTS.DIFFICULTY) {
				valueA = difficultyWeight(a.difficulty);
				valueB = difficultyWeight(b.difficulty);
			} else if (sortBy === SORTS.TIME) {
				valueA = a.time;
				valueB = b.time;
			} else if (sortBy === SORTS.STEPS) {
				valueA = a.steps;
				valueB = b.steps;
			}

			if (valueA < valueB) return sortDir === 'asc' ? -1 : 1;
			if (valueA > valueB) return sortDir === 'asc' ? 1 : -1;
			return 0;
		});

		return arr;
	}, [stats, sortBy, sortDir]);

	function renderSortLabel(column) {
		if (sortBy !== column) return null;
		return sortDir === 'asc' ? ' ↑' : ' ↓';
	}

	return (
		<div className="stats-table-wrapper">
			<div className="stats-table-header">


				<div className="stats-controls">
					<button
						type="button"
						onClick={() => handleSortChange(SORTS.DIFFICULTY)}
						className={sortBy === SORTS.DIFFICULTY ? 'active' : ''}
					>
						Сложность{renderSortLabel(SORTS.DIFFICULTY)}
					</button>
					<button
						type="button"
						onClick={() => handleSortChange(SORTS.TIME)}
						className={sortBy === SORTS.TIME ? 'active' : ''}
					>
						Время{renderSortLabel(SORTS.TIME)}
					</button>
					<button
						type="button"
						onClick={() => handleSortChange(SORTS.STEPS)}
						className={sortBy === SORTS.STEPS ? 'active' : ''}
					>
						Ходы{renderSortLabel(SORTS.STEPS)}
					</button>
				</div>
			</div>

			<table className="stats-table">
				<thead>
					<tr>
						<th>#</th>
						<th>Имя</th>
						<th>Сложность</th>
						<th>Ходы</th>
						<th>Время</th>
					</tr>
				</thead>
				<tbody>
					{sorted.map((item, index) => (
						<tr key={item.id ?? index}>
							<td>{index + 1}</td>
							<td>{item.name}</td>
							<td>{difficultyNames[item.difficulty] ?? item.difficulty}</td>
							<td>{item.steps}</td>
							<td>{formatTime(item.time)}</td>
						</tr>
					))}
				</tbody>
			</table>

			{sorted.length === 0 && (
				<p className="stats-empty">Пока нет ни одного прохождения.</p>
			)}
		</div>
	);
}

export default StatsTable;
