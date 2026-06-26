import { useEffect, useRef, useState } from "react";
import Tile from "./Tile";
import PathOverlay from "./PathOverlay";

const BOARD_GAP = 7;
const BOARD_PADDING = 14;
const MAX_TILE_SIZE = 76;
const MIN_TILE_SIZE = 28;
const FIT_SAFETY = 10;

function Board({ boardData, selectedTiles, hintTiles, pathPoints, onTileClick }) {
  if (!boardData || !boardData.board || boardData.board.length === 0) {
    return <p>Board game here</p>;
  }

  return (
    <PlayableBoard
      boardData={boardData}
      selectedTiles={selectedTiles}
      hintTiles={hintTiles}
      pathPoints={pathPoints}
      onTileClick={onTileClick}
    />
  );
}

function PlayableBoard({
  boardData,
  selectedTiles,
  hintTiles,
  pathPoints,
  onTileClick,
}) {
  const wrapperRef = useRef(null);
  const [tileSize, setTileSize] = useState(MAX_TILE_SIZE);

  const fullBoard = boardData.board;
  const totalRows = fullBoard.length;
  const totalCols = fullBoard[0].length;
  const playableRows = totalRows - 2;
  const playableCols = totalCols - 2;

  useEffect(() => {
    function updateTileSize() {
      const wrapper = wrapperRef.current;

      if (!wrapper || playableRows <= 0 || playableCols <= 0) {
        return;
      }

      const widthForTiles =
        wrapper.clientWidth -
        BOARD_PADDING * 2 -
        BOARD_GAP * (playableCols - 1) -
        FIT_SAFETY;

      const heightForTiles =
        wrapper.clientHeight -
        BOARD_PADDING * 2 -
        BOARD_GAP * (playableRows - 1) -
        FIT_SAFETY;

      const nextTileSize = Math.floor(
        Math.min(
          MAX_TILE_SIZE,
          widthForTiles / playableCols,
          heightForTiles / playableRows
        )
      );

      setTileSize(Math.max(MIN_TILE_SIZE, nextTileSize));
    }

    updateTileSize();

    const resizeObserver = new ResizeObserver(updateTileSize);

    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }

    window.addEventListener("resize", updateTileSize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateTileSize);
    };
  }, [playableRows, playableCols]);

  function containsTile(tileList, row, col) {
    return tileList.some((tile) => tile.row === row && tile.col === col);
  }

  return (
    <div className="board-scale-wrapper" ref={wrapperRef}>
      <div
        className="board"
        style={{
          "--tile-size": `${tileSize}px`,
          "--board-gap": `${BOARD_GAP}px`,
          "--board-padding": `${BOARD_PADDING}px`,
          "--playable-rows": playableRows,
          "--playable-cols": playableCols,
        }}
      >
        <PathOverlay pathPoints={pathPoints} />

        {Array.from({ length: playableRows }).map((_, visibleRowIndex) => {
          const realRow = visibleRowIndex + 1;

          return (
            <div className="board-row" key={realRow}>
              {Array.from({ length: playableCols }).map((_, visibleColIndex) => {
                const realCol = visibleColIndex + 1;
                const value = fullBoard[realRow][realCol];

                return (
                  <Tile
                    key={`${realRow}-${realCol}`}
                    row={realRow}
                    col={realCol}
                    value={value}
                    totalRows={totalRows}
                    totalCols={totalCols}
                    isSelected={containsTile(selectedTiles, realRow, realCol)}
                    isHint={containsTile(hintTiles, realRow, realCol)}
                    onTileClick={onTileClick}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Board;