const DIFFICULTY_PRESETS = {
  BEGINNER: {
    label: "Beginner",
    rows: 4,
    cols: 6,
    tileTypes: 6,
    description: "Small board, few tile types.",
  },
  EASY: {
    label: "Easy",
    rows: 6,
    cols: 8,
    tileTypes: 10,
    description: "Normal board for quick testing.",
  },
  MEDIUM: {
    label: "Medium",
    rows: 8,
    cols: 10,
    tileTypes: 20,
    description: "Bigger board with more AI logos.",
  },
  HARD: {
    label: "Hard",
    rows: 10,
    cols: 12,
    tileTypes: 30,
    description: "Large board, many tile types.",
  },
  INSANE: {
    label: "Insane",
    rows: 12,
    cols: 10,
    tileTypes: 40,
    description: "Maximum logo variety.",
  },
};

function ControlPanel({
  rows,
  cols,
  tileTypes,
  difficulty,
  setRows,
  setCols,
  setTileTypes,
  setDifficulty,
  onGenerate,
}) {
  const totalCells = rows * cols;
  const maxPairs = Math.floor(totalCells / 2);
  const currentPreset = DIFFICULTY_PRESETS[difficulty];

  function clamp(value, min, max) {
    if (Number.isNaN(value)) {
      return min;
    }

    return Math.min(Math.max(value, min), max);
  }

  function applyDifficulty(nextDifficulty) {
    const preset = DIFFICULTY_PRESETS[nextDifficulty];

    setDifficulty(nextDifficulty);
    setRows(preset.rows);
    setCols(preset.cols);
    setTileTypes(preset.tileTypes);
  }

  function handleDifficultyChange(e) {
    applyDifficulty(e.target.value);
  }

  function handleRowsChange(e) {
    const value = clamp(Number(e.target.value), 2, 14);
    setRows(value);
    setDifficulty("CUSTOM");

    const newMaxPairs = Math.floor((value * cols) / 2);
    if (tileTypes > newMaxPairs) {
      setTileTypes(newMaxPairs);
    }
  }

  function handleColsChange(e) {
    const value = clamp(Number(e.target.value), 2, 18);
    setCols(value);
    setDifficulty("CUSTOM");

    const newMaxPairs = Math.floor((rows * value) / 2);
    if (tileTypes > newMaxPairs) {
      setTileTypes(newMaxPairs);
    }
  }

  function handleTileTypesChange(e) {
    const value = clamp(Number(e.target.value), 1, maxPairs);
    setTileTypes(value);
    setDifficulty("CUSTOM");
  }

  return (
    <div className="panel">
      <h2>Controls</h2>

      <div className="form-group">
        <label>Difficulty</label>
        <select value={difficulty} onChange={handleDifficultyChange}>
          <option value="BEGINNER">Beginner</option>
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
          <option value="INSANE">Insane</option>
          <option value="CUSTOM">Custom</option>
        </select>
      </div>

      {currentPreset && (
        <p className="difficulty-description">
          {currentPreset.description}
        </p>
      )}

      <div className="difficulty-buttons">
        <button type="button" onClick={() => applyDifficulty("BEGINNER")}>
          Beginner
        </button>
        <button type="button" onClick={() => applyDifficulty("EASY")}>
          Easy
        </button>
        <button type="button" onClick={() => applyDifficulty("MEDIUM")}>
          Medium
        </button>
        <button type="button" onClick={() => applyDifficulty("HARD")}>
          Hard
        </button>
        <button type="button" onClick={() => applyDifficulty("INSANE")}>
          Insane
        </button>
      </div>

      <div className="form-group">
        <label>Rows</label>
        <input
          type="number"
          min="2"
          max="14"
          value={rows}
          onChange={handleRowsChange}
        />
      </div>

      <div className="form-group">
        <label>Cols</label>
        <input
          type="number"
          min="2"
          max="18"
          value={cols}
          onChange={handleColsChange}
        />
      </div>

      <div className="form-group">
        <label>Tile Types</label>
        <input
          type="number"
          min="1"
          max={maxPairs}
          value={tileTypes}
          onChange={handleTileTypesChange}
        />
      </div>

      <div className="control-info">
        <p>Total cells: {totalCells}</p>
        <p>Max pairs: {maxPairs}</p>
        <p>Current difficulty: {currentPreset?.label || "Custom"}</p>
      </div>

      <button className="primary-button" onClick={onGenerate}>
        Generate Board
      </button>
    </div>
  );
}

export default ControlPanel;