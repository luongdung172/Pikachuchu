package pikasolver.core.model;

import java.util.*;

public class MatchResult {
    private final boolean matchable;
    private final int turns;
    private final List<Point> path;

    public MatchResult(boolean matchable, int turns, List<Point> path) {
        this.matchable = matchable;
        this.turns = turns;
        this.path = path == null ? new ArrayList<>() : new ArrayList<>(path);
    }

    public static MatchResult success(int turns, List<Point> path){
        return new MatchResult(true, turns, path);
    }

    public static MatchResult failure(){
        return new MatchResult(false, 0, Collections.emptyList());
    }

    public boolean isMatchable() {
        return matchable;
    }

    public int getTurns() {
        return turns;
    }

    public List<Point> getPath() {
        return Collections.unmodifiableList(path);
    }
}