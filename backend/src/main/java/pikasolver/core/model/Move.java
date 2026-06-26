package pikasolver.core.model;

public class Move {
    private final Point from;
    private final Point to;

    public Move(Point from, Point to) {
        if (from == null || to == null) {
            throw new IllegalArgumentException("Points cannot be null");
        }

        if (from.equals(to)) {
            throw new IllegalArgumentException("From and To points cannot be the same");
        }

        this.from = from;
        this.to = to;
    }

    public Point getFrom() {
        return from;
    }

    public Point getTo() {
        return to;
    }

    @Override
    public String toString() {
        return "Move from " + from + " to " + to;
    }
}
