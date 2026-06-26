package pikasolver.api.player;

import java.time.Instant;

public class PlayerGameResultRequest {
    private String playerName;
    private String difficulty;
    private String difficultyLabel;
    private Integer rowsCount;
    private Integer colsCount;
    private Integer tileTypes;
    private Integer totalPairs;
    private Integer clearedPairs;
    private Integer helpUsed;
    private Integer finalScore;
    private GameResultStatus result;
    private String resultReason;
    private Integer timeLimitSeconds;
    private Integer timeLeftSeconds;
    private Integer playDurationSeconds;
    private Instant startedAt;
    private Instant finishedAt;

    public String getPlayerName() { return playerName; }
    public void setPlayerName(String playerName) { this.playerName = playerName; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public String getDifficultyLabel() { return difficultyLabel; }
    public void setDifficultyLabel(String difficultyLabel) { this.difficultyLabel = difficultyLabel; }
    public Integer getRowsCount() { return rowsCount; }
    public void setRowsCount(Integer rowsCount) { this.rowsCount = rowsCount; }
    public Integer getColsCount() { return colsCount; }
    public void setColsCount(Integer colsCount) { this.colsCount = colsCount; }
    public Integer getTileTypes() { return tileTypes; }
    public void setTileTypes(Integer tileTypes) { this.tileTypes = tileTypes; }
    public Integer getTotalPairs() { return totalPairs; }
    public void setTotalPairs(Integer totalPairs) { this.totalPairs = totalPairs; }
    public Integer getClearedPairs() { return clearedPairs; }
    public void setClearedPairs(Integer clearedPairs) { this.clearedPairs = clearedPairs; }
    public Integer getHelpUsed() { return helpUsed; }
    public void setHelpUsed(Integer helpUsed) { this.helpUsed = helpUsed; }
    public Integer getFinalScore() { return finalScore; }
    public void setFinalScore(Integer finalScore) { this.finalScore = finalScore; }
    public GameResultStatus getResult() { return result; }
    public void setResult(GameResultStatus result) { this.result = result; }
    public String getResultReason() { return resultReason; }
    public void setResultReason(String resultReason) { this.resultReason = resultReason; }
    public Integer getTimeLimitSeconds() { return timeLimitSeconds; }
    public void setTimeLimitSeconds(Integer timeLimitSeconds) { this.timeLimitSeconds = timeLimitSeconds; }
    public Integer getTimeLeftSeconds() { return timeLeftSeconds; }
    public void setTimeLeftSeconds(Integer timeLeftSeconds) { this.timeLeftSeconds = timeLeftSeconds; }
    public Integer getPlayDurationSeconds() { return playDurationSeconds; }
    public void setPlayDurationSeconds(Integer playDurationSeconds) { this.playDurationSeconds = playDurationSeconds; }
    public Instant getStartedAt() { return startedAt; }
    public void setStartedAt(Instant startedAt) { this.startedAt = startedAt; }
    public Instant getFinishedAt() { return finishedAt; }
    public void setFinishedAt(Instant finishedAt) { this.finishedAt = finishedAt; }
}
