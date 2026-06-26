package pikasolver.core.algorithm;

import pikasolver.core.model.Point;

import java.util.*;

public class SearchState {
    private final Point curPoint;
    private final Direction direction;
    private final int turns;
    private final List<Point> path;

    public SearchState(Point curPoint, Direction direction, int turns, List<Point> path) {
        if (curPoint == null) {
            throw new IllegalArgumentException("Current point and direction cannot be null.");
        }
        if (path == null) {
            throw new IllegalArgumentException("Path cannot be null.");
        }

        this.curPoint = curPoint;
        this.direction = direction;
        this.turns = turns;
        this.path = path == null ? new ArrayList<>() : new ArrayList<>(path);
    }

    public Point getCurPoint() {
        return curPoint;
    }

    public Direction getDirection() {
        return direction;
    }

    public int getTurns() {
        return turns;
    }

    public List<Point> getPath() {
        return Collections.unmodifiableList(path);
    }
}
