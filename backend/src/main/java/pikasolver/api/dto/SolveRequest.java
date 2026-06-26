package pikasolver.api.dto;

public class SolveRequest {
    private int[][] board;
    private String algorithm;

    public SolveRequest() {}

    public SolveRequest(int[][] board, String algorithm) {
        this.board = board;
        this.algorithm = algorithm;
    }

    public int[][] getBoard() {
        return board;
    }

    public String getAlgorithm() {
        return algorithm;
    }

    public void setBoard(int[][] board) {
        this.board = board;
    }

    public void setAlgorithm(String algorithm) {
        this.algorithm = algorithm;
    }
}