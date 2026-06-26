package pikasolver.core.solver;

import pikasolver.core.model.Board;
import pikasolver.core.model.SolveResult;

public interface Solver {
    SolveResult solve(Board board);
}
