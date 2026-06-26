package pikasolver.api.dto;

public class HintRequest {
    private int[][] board;

    public HintRequest() {}

    public HintRequest(int[][] board) {
        this.board = board;
    }

    public int[][] getBoard() {
        return board;
    }

    public void setBoard(int[][] board) {
        this.board = board;
    }
}