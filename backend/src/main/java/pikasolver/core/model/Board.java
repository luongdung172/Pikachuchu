package pikasolver.core.model;

public class Board {
    private static final int empty = 0;
    private final int rows;
    private final int cols;
    private final int[][] cells;

    public Board(int rows, int cols, int[][] cells) {
        if (rows <= 0 || cols <= 0){
            throw new IllegalArgumentException("Rows and columns must be positive integers");
        }

        if (cells == null || cells.length != rows) {
            throw new IllegalArgumentException("Cells array must match the number of rows");
        }

        for (int i = 0; i < rows; i++) {
            if (cells[i] == null || cells[i].length != cols) {
                throw new IllegalArgumentException("Each row in cells array must match the number of columns");
            }
        }

        this.rows = rows;
        this.cols = cols;
        this.cells = copyCells(cells);
    }

    public int getRows() {
        return rows;
    }
    public int getCols() {
        return cols;
    }

    public int getValue(Point point) {
        validatePoint(point);
        return cells[point.getRow()][point.getCol()];
    }

    public void setValue(Point point, int value) {
        validatePoint(point);

        if (value < 0) {
            throw new IllegalArgumentException("Value must be non-negative");
        }
        cells[point.getRow()][point.getCol()] = value;
    }

    public boolean isInside(Point point) {
        return point != null && point.getRow() >= 0 && point.getRow() < rows && point.getCol() >= 0 && point.getCol() < cols;
    }

    public boolean isEmpty(Point point) {
        validatePoint(point);
        return cells[point.getRow()][point.getCol()] == empty;
    }

    public boolean isPlayable(Point point) {
        validatePoint(point);
        return cells[point.getRow()][point.getCol()] > empty;
    }

    public boolean isSameTitle(Point a, Point b) {
        validatePoint(a);
        validatePoint(b);
        return isPlayable(a) && isPlayable(b) && getValue(a) == getValue(b);
    }

    public void removePair(Point a, Point b) {
        if (!isSameTitle(a, b)) {
            throw new IllegalArgumentException("Points do not have the same title or are not playable");
        }
        setValue(a, empty);
        setValue(b, empty);
    }

    public int[][] getCellsCopy() {
        return copyCells(cells);
    }

    public Board copy() {
        return new Board(rows, cols, cells);
    }

    private void validatePoint(Point point) {
        if (point == null) {
            throw new IllegalArgumentException("Point cannot be null");
        }
        if (!isInside(point)) {
            throw new IllegalArgumentException("Point is out of board bounds");
        }
    }

    private int[][] copyCells(int[][] source) {
        int[][] result = new int[source.length][source[0].length];

        for (int i = 0; i <source.length; i++) {
            System.arraycopy(source[i], 0, result[i], 0, source[i].length);
        }
        return result;
    }

    @Override
    public String toString() {
        String result = "";

        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {
                result += cells[row][col] + " ";
            }
            result += "\n";
        }

        return result;
    }
}
