package pikasolver.api.dto;

import pikasolver.core.model.Point;

public class HintResponse {
    private boolean hasHint;
    private Point from;
    private Point to;

    public HintResponse() {}

    public HintResponse(boolean hasHint, Point from, Point to) {
        this.hasHint = hasHint;
        this.from = from;
        this.to = to;
    }

    public boolean isHasHint() {
        return hasHint;
    }

    public Point getFrom() {
        return from;
    }

    public Point getTo() {
        return to;
    }

    public void setHasHint(boolean hasHint) {
        this.hasHint = hasHint;
    }

    public void setFrom(Point from) {
        this.from = from;
    }

    public void setTo(Point to) {
        this.to = to;
    }
}