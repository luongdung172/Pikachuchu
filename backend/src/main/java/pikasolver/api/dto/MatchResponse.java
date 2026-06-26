package pikasolver.api.dto;

import pikasolver.core.model.Point;

import java.util.List;

public class MatchResponse {
    private boolean matchable;
    private int turns;
    private List<Point> path;

    public MatchResponse() {}

    public MatchResponse(boolean matchable, int turns, List<Point> path) {
        this.matchable = matchable;
        this.turns = turns;
        this.path = path;
    }

    public boolean isMatchable() {
        return matchable;
    }

    public int getTurns() {
        return turns;
    }

    public List<Point> getPath() {
        return path;
    }

    public void setMatchable(boolean matchable) {
        this.matchable = matchable;
    }

    public void setTurns(int turns) {
        this.turns = turns;
    }

    public void setPath(List<Point> path) {
        this.path = path;
    }
}