import { useEffect, useRef, useState } from "react";

function PathOverlay({ pathPoints }) {
  const svgRef = useRef(null);
  const [points, setPoints] = useState("");

  useEffect(() => {
    if (!pathPoints || pathPoints.length < 2 || !svgRef.current) {
      setPoints("");
      return;
    }

    function getTileCenter(boardElement, boardRect, row, col) {
      const tileElement = boardElement.querySelector(
        `[data-row="${row}"][data-col="${col}"]`
      );

      if (tileElement) {
        const tileRect = tileElement.getBoundingClientRect();

        return {
          x: tileRect.left - boardRect.left + tileRect.width / 2,
          y: tileRect.top - boardRect.top + tileRect.height / 2,
        };
      }

      const firstTile = boardElement.querySelector(`[data-row="1"][data-col="1"]`);
      const secondColTile = boardElement.querySelector(`[data-row="1"][data-col="2"]`);
      const secondRowTile = boardElement.querySelector(`[data-row="2"][data-col="1"]`);

      if (!firstTile) {
        return null;
      }

      const firstRect = firstTile.getBoundingClientRect();
      const firstCenterX = firstRect.left - boardRect.left + firstRect.width / 2;
      const firstCenterY = firstRect.top - boardRect.top + firstRect.height / 2;

      let stepX = firstRect.width + 6;
      let stepY = firstRect.height + 6;

      if (secondColTile) {
        const secondRect = secondColTile.getBoundingClientRect();
        const secondCenterX = secondRect.left - boardRect.left + secondRect.width / 2;
        stepX = secondCenterX - firstCenterX;
      }

      if (secondRowTile) {
        const secondRect = secondRowTile.getBoundingClientRect();
        const secondCenterY = secondRect.top - boardRect.top + secondRect.height / 2;
        stepY = secondCenterY - firstCenterY;
      }

      return {
        x: firstCenterX + (col - 1) * stepX,
        y: firstCenterY + (row - 1) * stepY,
      };
    }

    function updatePathPoints() {
      const svgElement = svgRef.current;
      const boardElement = svgElement?.parentElement;

      if (!boardElement) {
        setPoints("");
        return;
      }

      const boardRect = boardElement.getBoundingClientRect();
      const svgPoints = pathPoints
        .map((point) => getTileCenter(boardElement, boardRect, point.row, point.col))
        .filter(Boolean)
        .map((point) => `${point.x},${point.y}`)
        .join(" ");

      setPoints(svgPoints);
    }

    updatePathPoints();

    const boardElement = svgRef.current.parentElement;
    const resizeObserver = new ResizeObserver(updatePathPoints);
    if (boardElement) {
      resizeObserver.observe(boardElement);
    }

    window.addEventListener("resize", updatePathPoints);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updatePathPoints);
    };
  }, [pathPoints]);

  return (
    <svg ref={svgRef} className="path-overlay">
      {points && <polyline className="path-line" points={points} />}
    </svg>
  );
}

export default PathOverlay;
