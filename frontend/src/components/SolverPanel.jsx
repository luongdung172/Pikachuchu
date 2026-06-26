function SolverPanel({ algorithm, setAlgorithm, onHint, onSolve }) {
  return (
    <div className="panel">
      <h2>Solver</h2>

      <div className="form-group">
        <label>Algorithm</label>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
        >
          <option value="GREEDY">GREEDY</option>
          <option value="BACKTRACK">BACKTRACK</option>
        </select>
      </div>

      <button className="secondary-button" onClick={onHint}>
        Hint
      </button>

      <button className="primary-button solver-button" onClick={onSolve}>
        Solve
      </button>
    </div>
  );
}

export default SolverPanel;