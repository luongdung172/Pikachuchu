package pikasolver.api.dto;

public class BoardResponse {
    private int rows;
    private int cols;
    private int[][] board;
    private boolean solved;
    private int remainingPairs;

    public BoardResponse() {}

    public BoardResponse(int rows, int cols, int[][] board, boolean solved, int remainingPairs) {
        this.rows = rows;
        this.cols = cols;
        this.board = board;
        this.solved = solved;
        this.remainingPairs = remainingPairs;
    }

    public int getRows() {
        return rows;
    }

    public int getCols() {
        return cols;
    }

    public int[][] getBoard() {
        return board;
    }

    public boolean isSolved() {
        return solved;
    }

    public int getRemainingPairs() {
        return remainingPairs;
    }

    public void setRows(int rows) {
        this.rows = rows;
    }

    public void setCols(int cols) {
        this.cols = cols;
    }

    public void setBoard(int[][] board) {
        this.board = board;
    }

    public void setSolved(boolean solved) {
        this.solved = solved;
    }

    public void setRemainingPairs(int remainingPairs) {
        this.remainingPairs = remainingPairs;
    }
}