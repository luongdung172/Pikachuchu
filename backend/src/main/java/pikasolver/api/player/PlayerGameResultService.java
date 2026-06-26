package pikasolver.api.player;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Service
public class PlayerGameResultService {
    private static final int MAX_PLAYER_NAME_LENGTH = 80;
    private final PlayerGameResultRepository repository;

    public PlayerGameResultService(PlayerGameResultRepository repository) {
        this.repository = repository;
    }

    public PlayerGameResult save(PlayerGameResultRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Result request cannot be null");
        }

        Instant now = Instant.now();
        Instant startedAt = request.getStartedAt() == null ? now : request.getStartedAt();
        Instant finishedAt = request.getFinishedAt() == null ? now : request.getFinishedAt();

        PlayerGameResult result = new PlayerGameResult();
        result.setPlayerName(cleanPlayerName(request.getPlayerName()));
        result.setDifficulty(cleanText(request.getDifficulty(), "UNKNOWN", 40));
        result.setDifficultyLabel(cleanText(request.getDifficultyLabel(), "Unknown", 40));
        result.setRowsCount(nonNegative(request.getRowsCount()));
        result.setColsCount(nonNegative(request.getColsCount()));
        result.setTileTypes(nonNegative(request.getTileTypes()));
        result.setTotalPairs(nonNegative(request.getTotalPairs()));
        result.setClearedPairs(nonNegative(request.getClearedPairs()));
        result.setHelpUsed(nonNegative(request.getHelpUsed()));
        result.setFinalScore(nonNegative(request.getFinalScore()));
        result.setResult(request.getResult() == null ? GameResultStatus.LOSE : request.getResult());
        result.setResultReason(cleanText(request.getResultReason(), "UNKNOWN", 40));
        result.setTimeLimitSeconds(nonNegative(request.getTimeLimitSeconds()));
        result.setTimeLeftSeconds(nonNegative(request.getTimeLeftSeconds()));
        result.setPlayDurationSeconds(resolveDurationSeconds(request.getPlayDurationSeconds(), startedAt, finishedAt));
        result.setStartedAt(startedAt);
        result.setFinishedAt(finishedAt);

        return repository.save(result);
    }

    public List<PlayerGameResult> listLatest() {
        return repository.findTop100ByOrderByCreatedAtDesc();
    }

    private String cleanPlayerName(String value) {
        return cleanText(value, "Guest", MAX_PLAYER_NAME_LENGTH);
    }

    private String cleanText(String value, String fallback, int maxLength) {
        String cleaned = value == null ? "" : value.trim();
        if (cleaned.isEmpty()) {
            cleaned = fallback;
        }
        return cleaned.length() > maxLength ? cleaned.substring(0, maxLength) : cleaned;
    }

    private Integer nonNegative(Integer value) {
        if (value == null || value < 0) {
            return 0;
        }
        return value;
    }

    private Integer resolveDurationSeconds(Integer provided, Instant startedAt, Instant finishedAt) {
        if (provided != null && provided >= 0) {
            return provided;
        }
        long seconds = Duration.between(startedAt, finishedAt).getSeconds();
        return Math.toIntExact(Math.max(0, Math.min(seconds, Integer.MAX_VALUE)));
    }
}
