package pikasolver.api.player;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
public class PlayerGameResultController {
    private final PlayerGameResultService service;

    public PlayerGameResultController(PlayerGameResultService service) {
        this.service = service;
    }

    @PostMapping
    public PlayerGameResult save(@RequestBody PlayerGameResultRequest request) {
        return service.save(request);
    }

    @GetMapping
    public List<PlayerGameResult> latest() {
        return service.listLatest();
    }
}
