package pikasolver.core.algorithm;

import pikasolver.core.model.Board;
import pikasolver.core.model.MatchResult;
import pikasolver.core.model.Point;

import java.util.*;

public class PathFinder {
    private static final int maxTurns = 2;

    public MatchResult checkMatch(Board board, Point start, Point end) {
        if (!isValidInput(board, start, end)) {
            return MatchResult.failure();
        }

        Queue<SearchState> queue = new ArrayDeque<>();
        boolean [][][][] visited = new boolean[board.getRows()][board.getCols()][Direction.ALL.length][maxTurns + 1];

        List<Point> initialPath = new ArrayList<>();
        initialPath.add(start);

        queue.add(new SearchState(start, null, 0, initialPath));

        while (!queue.isEmpty()) {
            SearchState state = queue.poll();
            Point curPoint = state.getCurPoint();

            if (curPoint.equals(end)) {
                return MatchResult.success(state.getTurns(), state.getPath());
            }

            for (int directionIndex = 0; directionIndex < Direction.ALL.length; directionIndex++){
                Direction nextDirection = Direction.ALL[directionIndex];

                int nextRow = curPoint.getRow() + nextDirection.getRowOffset();
                int nextCol = curPoint.getCol() + nextDirection.getColOffset();
                if (nextRow < 0 || nextRow >= board.getRows() || nextCol < 0 || nextCol >= board.getCols()) {
                    continue;
                }

                Point nextPoint = new Point(nextRow, nextCol);

                int nextTurns = calculateTurns(state.getDirection(), nextDirection, state.getTurns());

                if (nextTurns > maxTurns) {
                    continue;
                }

                if (!canPass(board, nextPoint, end)) {
                    continue;
                }

                if (visited[nextPoint.getRow()][nextPoint.getCol()][directionIndex][nextTurns]) {
                    continue;
                }

                visited[nextPoint.getRow()][nextPoint.getCol()][directionIndex][nextTurns] = true;

                List<Point> nextPath = new ArrayList<>(state.getPath());
                nextPath.add(nextPoint);

                queue.add(new SearchState(nextPoint, nextDirection, nextTurns, nextPath));
            }
        }
        return MatchResult.failure();
    }

    private boolean isValidInput(Board board, Point start, Point end) {
        if (board == null || start == null || end == null) {
            return false;
        }

        if (!board.isInside(start) || !board.isInside(end)) {
            return false;
        }

        if (start.equals(end)) {
            return false;
        }

        return board.isSameTitle(start, end);
    }

    private int calculateTurns(Direction oldDirection, Direction newDirection, int currentTurns) {
        if (oldDirection == null || oldDirection == newDirection) {
            return currentTurns;
        }
        return currentTurns + 1;
    }

    private boolean canPass(Board board, Point point, Point end) {
        return board.isEmpty(point) || point.equals(end);
    }
}

