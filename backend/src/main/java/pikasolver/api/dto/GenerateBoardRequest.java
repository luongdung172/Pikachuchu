package pikasolver.api.dto;

public class GenerateBoardRequest {
    private int rows;
    private int cols;
    private int tileTypes;

    public GenerateBoardRequest() {}

    public GenerateBoardRequest(int rows, int cols, int tileTypes) {
        this.rows = rows;
        this.cols = cols;
        this.tileTypes = tileTypes;
    }

    public int getRows() {
        return rows;
    }

    public int getCols() {
        return cols;
    }

    public int getTileTypes() {
        return tileTypes;
    }

    public void setRows(int rows) {
        this.rows = rows;
    }

    public void setCols(int cols) {
        this.cols = cols;
    }

    public void setTileTypes(int tileTypes) {
        this.tileTypes = tileTypes;
    }
}