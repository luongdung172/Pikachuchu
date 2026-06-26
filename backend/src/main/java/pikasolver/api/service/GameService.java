package pikasolver.api.service;

import pikasolver.api.dto.*;

import pikasolver.core.engine.GameEngine;
import pikasolver.core.model.*;

public class GameService {
    private final GameEngine gameEngine;

    public GameService() {
        this.gameEngine = new GameEngine();
    }

    public GameService(GameEngine gameEngine) {
        if (gameEngine == null) {
            throw new IllegalArgumentException("GameEngine cannot be null");
        }

        this.gameEngine = gameEngine;
    }

    public BoardResponse generateBoard(GenerateBoardRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request cannot be null");
        }

        Board board = gameEngine.generateBoard(request.getRows(), request.getCols(), request.getTileTypes());

        return new BoardResponse(board.getRows(), board.getCols(), board.getCellsCopy(), gameEngine.isSolved(board), gameEngine.countRemainingPairs(board));
    }

    public MatchResponse checkMatch(CheckMatchRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request cannot be null");
        }

        Board board = createBoardFromArray(request.getBoard());

        Point from = new Point(request.getFromRow(), request.getFromCol());
        Point to = new Point(request.getToRow(), request.getToCol());

        MatchResult result = gameEngine.checkMatch(board, from, to);

        return new MatchResponse(result.isMatchable(), result.getTurns(), result.getPath());
    }

    public BoardResponse removePair(RemovePairRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request cannot be null");
        }

        Board board = createBoardFromArray(request.getBoard());

        Point from = new Point(request.getFromRow(), request.getFromCol());
        Point to = new Point(request.getToRow(), request.getToCol());

        Board newBoard = gameEngine.removePair(board, from, to);

        return new BoardResponse(newBoard.getRows(), newBoard.getCols(), newBoard.getCellsCopy(), gameEngine.isSolved(newBoard), gameEngine.countRemainingPairs(newBoard));
    }

    public HintResponse getHint(HintRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request cannot be null");
        }
        
        Board board = createBoardFromArray(request.getBoard());

        Move hint = gameEngine.getHint(board);

        if (hint == null) {
            return new HintResponse(false, null, null);
        }

        return new HintResponse(true, hint.getFrom(), hint.getTo());
    }

    public SolveResponse solve(SolveRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request cannot be null");
        }
        
        Board board = createBoardFromArray(request.getBoard());

        SolveResult result = gameEngine.solve(board, request.getAlgorithm());

        SolverStats stats = result.getStats();

        return new SolveResponse(result.getFinalBoard().getCellsCopy(), result.getMoves(), stats.isSolved(), stats.getExploredStates(), stats.getBacktracks(), stats.getRunTimeMs(), stats.getRemainingPairs());
    }

    private Board createBoardFromArray(int[][] cells) {
        if (cells == null || cells.length == 0) {
            throw new IllegalArgumentException("Board cannot be null or empty");
        }

        if (cells[0] == null || cells[0].length == 0) {
            throw new IllegalArgumentException("Board row cannot be null or empty");
        }

        int rows = cells.length;
        int cols = cells[0].length;

        return new Board(rows, cols, cells);
    }  
}