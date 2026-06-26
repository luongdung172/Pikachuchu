package pikasolver.core.model;

import java.util.Objects;

public class Point {
    private final int row;
    private final int col;

    public Point(int row, int col) {
        if (row < 0 || col < 0) {
            throw new IllegalArgumentException("Row and column must be non-negative.");
        }

        this.row = row;
        this.col = col;
    }

    public int getRow() {
        return row;
    }

    public int getCol() {
        return col;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }

        if (!(o instanceof Point)) {
            return false;
        }

        Point point = (Point) o;
        return this.row == point.row && this.col == point.col;
    }

    @Override
    public int hashCode() {
        return Objects.hash(row, col);
    }

    @Override
    public String toString() {
        return "(" + row + ", " + col + ")";
    }

}