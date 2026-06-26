package pikasolver.core.algorithm;

public class Direction {
    public static final Direction UP = new Direction(-1, 0);
    public static final Direction DOWN = new Direction(1, 0);
    public static final Direction LEFT = new Direction(0, -1);
    public static final Direction RIGHT = new Direction(0, 1);

    public static final Direction[] ALL = {UP, DOWN, LEFT, RIGHT};

    private final int rowOffset;
    private final int colOffset;

    public Direction(int rowOffset, int colOffset) {
        this.rowOffset = rowOffset;
        this.colOffset = colOffset;
    }

    public int getRowOffset() {
        return rowOffset;
    }

    public int getColOffset() {
        return colOffset;
    }
}
