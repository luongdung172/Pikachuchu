package pikasolver.api.player;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "player_game_results")
public class PlayerGameResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String playerName;

    @Column(nullable = false, length = 40)
    private String difficulty;

    @Column(nullable = false, length = 40)
    private String difficultyLabel;

    @Column(nullable = false)
    private Integer rowsCount;

    @Column(nullable = false)
    private Integer colsCount;

    @Column(nullable = false)
    private Integer tileTypes;

    @Column(nullable = false)
    private Integer totalPairs;

    @Column(nullable = false)
    private Integer clearedPairs;

    @Column(nullable = false)
    private Integer helpUsed;

    @Column(nullable = false)
    private Integer finalScore;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private GameResultStatus result;

    @Column(nullable = false, length = 40)
    private String resultReason;

    @Column(nullable = false)
    private Integer timeLimitSeconds;

    @Column(nullable = false)
    private Integer timeLeftSeconds;

    @Column(nullable = false)
    private Integer playDurationSeconds;

    @Column(nullable = false)
    private Instant startedAt;

    @Column(nullable = false)
    private Instant finishedAt;

    @Column(nullable = false)
    private Instant createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
