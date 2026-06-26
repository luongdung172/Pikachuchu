package pikasolver.api.dto;

public class RemovePairRequest {
    private int[][] board;
    private int fromRow;
    private int fromCol;
    private int toRow;
    private int toCol;

    public RemovePairRequest() {}

    public RemovePairRequest(int[][] board, int fromRow, int fromCol, int toRow, int toCol) {
        this.board = board;
        this.fromRow = fromRow;
        this.fromCol = fromCol;
        this.toRow = toRow;
        this.toCol = toCol;
    }

    public int[][] getBoard() {
        return board;
    }

    public int getFromRow() {
        return fromRow;
    }

    public int getFromCol() {
        return fromCol;
    }

    public int getToRow() {
        return toRow;
    }

    public int getToCol() {
        return toCol;
    }

    public void setBoard(int[][] board) {
        this.board = board;
    }

    public void setFromRow(int fromRow) {
        this.fromRow = fromRow;
    }

    public void setFromCol(int fromCol) {
        this.fromCol = fromCol;
    }

    public void setToRow(int toRow) {
        this.toRow = toRow;
    }

    public void setToCol(int toCol) {
        this.toCol = toCol;
    }
}