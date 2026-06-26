package pikasolver.api.player;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlayerGameResultRepository extends JpaRepository<PlayerGameResult, Long> {
    List<PlayerGameResult> findTop100ByOrderByCreatedAtDesc();
}
