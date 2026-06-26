package pikasolver.core.algorithm;

import pikasolver.core.model.Board;

import java.util.*;

public class BoardGenerator {
    public Board generate(int innerRows, int innerCols, int tileTypes) {
        validateInput(innerRows, innerCols, tileTypes);

        int totalTiles = innerRows * innerCols;

        List<Integer> titles = createTilePairs(totalTiles, tileTypes);
        Collections.shuffle(titles);

        int rows = innerRows + 2;
        int cols = innerCols + 2;
        int[][] cells = new int[rows][cols];

        int index = 0;
        for (int row = 1; row <= innerRows; row++) {
            for (int col = 1; col <= innerCols; col++) {
                cells[row][col] = titles.get(index);
                index++;
            }
        }
        return new Board(rows, cols, cells);
    }

    private void validateInput(int innerRows, int innerCols, int tileTypes) {
        if (innerRows <= 0 || innerCols <= 0) {
            throw new IllegalArgumentException("Inner rows and columns must be positive.");
        }

        int totalTiles = innerRows * innerCols;
        if (totalTiles % 2 != 0) {
            throw new IllegalArgumentException("Total number of tiles must be even.");
        }
        if (tileTypes <= 0) {
            throw new IllegalArgumentException("Tile types must be positive.");
        }
    }

    private List<Integer> createTilePairs(int totalTiles, int tileTypes) {
        List<Integer> tiles = new ArrayList<>();
        for (int i = 0; i < totalTiles / 2; i++) {
            int tileValue = (i % tileTypes) + 1;
            tiles.add(tileValue);
            tiles.add(tileValue);
        }
        return tiles;
    }


}
