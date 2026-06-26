package pikasolver.core.model;

public class SolverStats {
    private final int exploredStates;
    private final int backtracks;
    private final long runtimeMs;
    private final boolean solved;
    private final int remainingPairs;

    public SolverStats(int exploredStates, int backtracks, long runtimeMs, boolean solved, int remainingPairs) {
        if (exploredStates < 0 || backtracks < 0 || runtimeMs < 0 || remainingPairs < 0) {
            throw new IllegalArgumentException("State valuesmust be non-negative.");
        }
        
        this.exploredStates = exploredStates;
        this.backtracks = backtracks;
        this.runtimeMs = runtimeMs;
        this.solved = solved;
        this.remainingPairs = remainingPairs;
    }

    public int getExploredStates() {
        return exploredStates;
    }

    public int getBacktracks() {
        return backtracks;
    }

    public long getRunTimeMs() {
        return runtimeMs;
    }

    public boolean isSolved() {
        return solved;
    }

    public int getRemainingPairs() {
        return remainingPairs;
    }
}
