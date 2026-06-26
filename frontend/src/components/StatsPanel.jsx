function StatsPanel({ message, boardData, solveResult }) {
  return (
    <div className="panel">
      <h2>Status</h2>

      <p>{message}</p>

      {boardData && (
        <div className="board-stats">
          <p>Rows: {boardData.rows}</p>
          <p>Cols: {boardData.cols}</p>
          <p>Solved: {String(boardData.solved)}</p>
          <p>Remaining pairs: {boardData.remainingPairs}</p>
        </div>
      )}

      {solveResult && (
        <div className="solve-stats">
          <h3>Solve Stats</h3>
          <p>Moves: {solveResult.moves?.length ?? 0}</p>
          <p>Runtime: {solveResult.runtimeMs} ms</p>
          <p>Explored states: {solveResult.exploredStates}</p>
          <p>Backtracks: {solveResult.backtracks}</p>
        </div>
      )}
    </div>
  );
}

export default StatsPanel;