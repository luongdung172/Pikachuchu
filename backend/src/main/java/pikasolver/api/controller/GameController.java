package pikasolver.api.controller;

import org.springframework.web.bind.annotation.*;

import pikasolver.api.dto.*;
import pikasolver.api.service.GameService;

@RestController
@RequestMapping("/api/game")
public class GameController {
    private final GameService gameService;

    public GameController() {
        this.gameService = new GameService();
    }

    @PostMapping("/generate")
    public BoardResponse generateBoard(@RequestBody GenerateBoardRequest request) {
        return gameService.generateBoard(request);
    }

    @PostMapping("/check-match")
    public MatchResponse checkMatch(@RequestBody CheckMatchRequest request) {
        return gameService.checkMatch(request);
    }

    @PostMapping("/remove-pair")
    public BoardResponse removePair(@RequestBody RemovePairRequest request) {
        return gameService.removePair(request);
    }

    @PostMapping("/hint")
    public HintResponse getHint(@RequestBody HintRequest request) {
        return gameService.getHint(request);
    }

    @PostMapping("/solve")
    public SolveResponse solve(@RequestBody SolveRequest request) {
        return gameService.solve(request);
    }
}
