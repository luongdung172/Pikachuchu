import { useEffect, useRef, useState } from "react";
import Board from "./components/Board";
import {
  generateBoard,
  checkMatch,
  removePair,
  getHint,
  saveGameResult,
} from "./api/gameApi";

import chatgptLogo from "./assets/chatgpt.png";
import geminiLogo from "./assets/gemini.png";
import claudeLogo from "./assets/claude.png";
import deepseekLogo from "./assets/deepseek.png";
import grokLogo from "./assets/grok.png";
import copilotLogo from "./assets/copilot.png";
import llamaLogo from "./assets/llama.png";
import qwenLogo from "./assets/qwen.png";
import pikaLogo from "./assets/pika.png";
import soraLogo from "./assets/sora.png";
import runwayLogo from "./assets/runway.png";
import perplexityLogo from "./assets/perplexity.png";

const MAX_TILE_TYPES = 40;
const MAX_SHUFFLE_ATTEMPTS = 120;
const TIMER_SECONDS = 180;

const TIMER_CONFIG = {
  BEGINNER: {
    timeLimitSeconds: TIMER_SECONDS,
    warningAtSeconds: 120,
    dangerAtSeconds: 60,
  },
  EASY: {
    timeLimitSeconds: TIMER_SECONDS,
    warningAtSeconds: 120,
    dangerAtSeconds: 60,
  },
  MEDIUM: {
    timeLimitSeconds: TIMER_SECONDS,
    warningAtSeconds: 120,
    dangerAtSeconds: 60,
  },
  HARD: {
    timeLimitSeconds: 300, // 5:00
    warningAtSeconds: 210, // 3:30
    dangerAtSeconds: 90, // 1:30
  },
  INSANE: {
    timeLimitSeconds: 600, // 10:00
    warningAtSeconds: 420, // 7:00
    dangerAtSeconds: 150, // 2:30
  },
};
const MAX_HELP_USES = 5;
const BASE_MATCH_SCORE = 5;
const COMBO_WINDOW_MS = 5000;

const START_RAIN_LOGOS = [
  chatgptLogo,
  geminiLogo,
  claudeLogo,
  deepseekLogo,
  grokLogo,
  copilotLogo,
  llamaLogo,
  qwenLogo,
  pikaLogo,
  soraLogo,
  runwayLogo,
  perplexityLogo,
];

const START_RAIN_ITEMS = Array.from({ length: 28 }, (_, index) => {
  const logo = START_RAIN_LOGOS[index % START_RAIN_LOGOS.length];

  return {
    id: `start-rain-logo-${index}`,
    logo,
    left: `${(index * 37) % 100}%`,
    size: `${34 + ((index * 11) % 30)}px`,
    duration: `${16 + ((index * 5) % 14)}s`,
    delay: `-${(index * 3) % 18}s`,
    drift: `${((index % 7) - 3) * 18}px`,
    rotate: `${((index % 9) - 4) * 18}deg`,
    opacity: 0.16 + (index % 5) * 0.035,
  };
});

const RESULT_VIDEO_PATHS = {
  WIN: "/videos/win.mp4",
  LOSE: "/videos/lose.mp4",
};

const DIFFICULTY_PRESETS = {
  BEGINNER: {
    label: "Beginner",
    rows: 4,
    cols: 6,
    tileTypes: 6,
  },
  EASY: {
    label: "Easy",
    rows: 6,
    cols: 8,
    tileTypes: 10,
  },
  MEDIUM: {
    label: "Medium",
    rows: 8,
    cols: 10,
    tileTypes: 20,
  },
  HARD: {
    label: "Hard",
    rows: 10,
    cols: 12,
    tileTypes: 30,
  },
  INSANE: {
    label: "Insane",
    rows: 12,
    cols: 10,
    tileTypes: 40,
  },
};

function StartLogoRain() {
  return (
    <div className="start-logo-rain" aria-hidden="true">
      {START_RAIN_ITEMS.map((item) => (
        <span
          className="start-logo-rain-item"
          key={item.id}
          style={{
            "--rain-left": item.left,
            "--rain-size": item.size,
            "--rain-duration": item.duration,
            "--rain-delay": item.delay,
            "--rain-drift": item.drift,
            "--rain-rotate": item.rotate,
            "--rain-opacity": item.opacity,
          }}
        >
          <img src={item.logo} alt="" />
        </span>
      ))}
    </div>
  );
}

function GamePage() {
  const [screen, setScreen] = useState("START");

  const [playerName, setPlayerName] = useState("");
  const [difficulty, setDifficulty] = useState("BEGINNER");

  const [customRows, setCustomRows] = useState(8);
  const [customCols, setCustomCols] = useState(10);
  const [customTileTypes, setCustomTileTypes] = useState(20);

  const [boardData, setBoardData] = useState(null);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [hintTiles, setHintTiles] = useState([]);
  const [pathPoints, setPathPoints] = useState([]);

  const [message, setMessage] = useState("Choose a mode and start the game.");
  const [isSolving, setIsSolving] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [helpUsesLeft, setHelpUsesLeft] = useState(MAX_HELP_USES);
  const [score, setScore] = useState(0);
  const [comboStreak, setComboStreak] = useState(0);
  const [lastMatchBonus, setLastMatchBonus] = useState(0);
  const [comboWindowPercent, setComboWindowPercent] = useState(0);
  const [comboBurst, setComboBurst] = useState(null);
  const [totalPairs, setTotalPairs] = useState(0);
  const [gameResult, setGameResult] = useState(null);
  const [resultReason, setResultReason] = useState(null);
  const [resultVideoFailed, setResultVideoFailed] = useState(false);
  const [isResultSoundOn, setIsResultSoundOn] = useState(false);
  const [resultVideoLayout, setResultVideoLayout] = useState("landscape");

  const timeLeftRef = useRef(TIMER_SECONDS);
  const lastMatchAtRef = useRef(null);
  const comboStreakRef = useRef(0);
  const matchCountRef = useRef(0);
  const resultVideoRef = useRef(null);
  const gameStartedAtRef = useRef(null);
  const savedResultRef = useRef(false);
  const helpUsedRef = useRef(0);
  const finalScoreRef = useRef(0);

  const isCustomMode = difficulty === "CUSTOM";

  const currentMode = isCustomMode
    ? {
        label: "Custom",
        rows: customRows,
        cols: customCols,
        tileTypes: customTileTypes,
      }
    : DIFFICULTY_PRESETS[difficulty];

  const timerConfig = TIMER_CONFIG[difficulty] ?? TIMER_CONFIG.MEDIUM;
  const currentTimeLimitSeconds = isCustomMode
    ? 0
    : timerConfig.timeLimitSeconds;

  const isTimedMode = !isCustomMode;
  const hasHelpLimit = !isCustomMode;
  const isHelpAvailable = !hasHelpLimit || helpUsesLeft > 0;
  const isTimeUp = screen === "GAME" && isTimedMode && timeLeft <= 0 && !boardData?.solved;
  const isGameLocked = isSolving || isTimeUp || gameResult !== null;

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    if (screen !== "GAME" || comboStreak === 0 || gameResult !== null) {
      setComboWindowPercent(0);
      return undefined;
    }

    function updateComboWindow() {
      const lastMatchAt = lastMatchAtRef.current;

      if (!lastMatchAt) {
        setComboWindowPercent(0);
        return;
      }

      const elapsedMs = Date.now() - lastMatchAt;
      const nextPercent = Math.max(
        0,
        100 - (elapsedMs / COMBO_WINDOW_MS) * 100
      );

      setComboWindowPercent(nextPercent);

      if (elapsedMs >= COMBO_WINDOW_MS) {
        resetCombo();
      }
    }

    updateComboWindow();

    const intervalId = window.setInterval(updateComboWindow, 80);

    return () => window.clearInterval(intervalId);
  }, [screen, comboStreak, lastMatchBonus, gameResult]);

  useEffect(() => {
    setResultVideoFailed(false);
    setIsResultSoundOn(false);
    setResultVideoLayout("landscape");
  }, [gameResult]);

  useEffect(() => {
    if (!gameResult || resultVideoFailed) {
      return;
    }

    const video = resultVideoRef.current;
    if (!video) {
      return;
    }

    video.currentTime = 0;
    video.volume = 1;
    video.muted = false;

    const playPromise = video.play();

    if (!playPromise || typeof playPromise.catch !== "function") {
      setIsResultSoundOn(!video.muted && video.volume > 0);
      return;
    }

    playPromise
      .then(() => {
        setIsResultSoundOn(!video.muted && video.volume > 0);
      })
      .catch(() => {
        video.muted = true;
        setIsResultSoundOn(false);
        video.play().catch(() => {});
      });
  }, [gameResult, resultVideoFailed]);

  useEffect(() => {
    if (screen !== "GAME" || !isTimedMode || !boardData || boardData.solved || timeLeft <= 0) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setTimeLeft((currentTimeLeft) => {
        const nextTimeLeft = Math.max(0, currentTimeLeft - 1);
        timeLeftRef.current = nextTimeLeft;
        return nextTimeLeft;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [screen, isTimedMode, boardData, timeLeft]);

  useEffect(() => {
    if (isTimeUp) {
      setSelectedTiles([]);
      setHintTiles([]);
      setPathPoints([]);
      setIsSolving(false);
      finishGame("LOSE", "TIME_UP", "Time is up!");
    }
  }, [isTimeUp]);

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function getComboBurstText(nextComboStreak, isFirstMatchOfGame) {
    if (isFirstMatchOfGame) {
      return "first blood";
    }

    if (nextComboStreak <= 1) {
      return "good";
    }

    if (nextComboStreak === 2) {
      return "nice try";
    }

    if (nextComboStreak === 3) {
      return "ultimate";
    }

    if (nextComboStreak === 4) {
      return "onslaught";
    }

    if (nextComboStreak === 5) {
      return "fightback";
    }

    if (nextComboStreak === 6) {
      return "dominating";
    }

    return "legendary";
  }

  function resetCombo() {
    lastMatchAtRef.current = null;
    comboStreakRef.current = 0;
    setComboStreak(0);
    setLastMatchBonus(0);
    setComboWindowPercent(0);
    setComboBurst(null);
  }

  function resetScoreState(initialTotalPairs = 0) {
    lastMatchAtRef.current = null;
    comboStreakRef.current = 0;
    matchCountRef.current = 0;
    finalScoreRef.current = 0;
    setScore(0);
    setComboStreak(0);
    setLastMatchBonus(0);
    setComboWindowPercent(0);
    setComboBurst(null);
    setTotalPairs(initialTotalPairs);
  }

  function awardMatchScore() {
    const now = Date.now();
    const isFastCombo =
      lastMatchAtRef.current !== null &&
      now - lastMatchAtRef.current <= COMBO_WINDOW_MS;

    const nextComboStreak = isFastCombo ? comboStreakRef.current + 1 : 1;
    const gainedPoints = nextComboStreak * BASE_MATCH_SCORE;
    const isFirstMatchOfGame = matchCountRef.current === 0;
    const burstText = getComboBurstText(nextComboStreak, isFirstMatchOfGame);

    matchCountRef.current += 1;
    lastMatchAtRef.current = now;
    comboStreakRef.current = nextComboStreak;

    setComboStreak(nextComboStreak);
    setLastMatchBonus(gainedPoints);
    setComboWindowPercent(100);
    setComboBurst({
      id: now,
      text: burstText,
    });
    finalScoreRef.current += gainedPoints;
    setScore(finalScoreRef.current);

    return {
      points: gainedPoints,
      streak: nextComboStreak,
      burstText,
    };
  }

  function getTimerTone(secondsLeft) {
    if (secondsLeft <= timerConfig.dangerAtSeconds) {
      return "danger";
    }

    if (secondsLeft <= timerConfig.warningAtSeconds) {
      return "warning";
    }

    return "normal";
  }

  function getProgressTone(percent) {
    if (percent < 20) {
      return "danger";
    }

    if (percent < 70) {
      return "warning";
    }

    return "success";
  }

  function formatPairLabel(value) {
    return value === 1 ? "pair" : "pairs";
  }

  function formatTime(totalSeconds) {
    const safeSeconds = Math.max(0, totalSeconds);
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  function getResultTitle() {
    if (resultReason === "AUTO_SOLVE") {
      return "Auto Solve Used!";
    }

    return gameResult === "WIN" ? "You Win!" : "Time's Up!";
  }

  function getResultMessage() {
    const safePlayerName = playerName.trim() || "Guest";

    if (resultReason === "AUTO_SOLVE") {
      return "PIKACHU{n0t_th4t_g00d_h4haa_better_7ry_3a51er_m0de}";
    }

    if (gameResult === "WIN") {
      return `PIKACHU{p1k4_p1k4_y0u_mu57_h4v3_3xellen7_ey3s}`;
    }

    return "PIKACHU{n0t_th4t_g00d_h4haa_better_7ry_3a51er_m0de}";
  }

  function updateResultVideoLayout(event) {
    const video = event.currentTarget;
    const width = video.videoWidth || 16;
    const height = video.videoHeight || 9;

    setResultVideoLayout(height > width ? "portrait" : "landscape");
  }

  function toggleResultSound() {
    const video = resultVideoRef.current;

    if (!video || resultVideoFailed) {
      return;
    }

    if (isResultSoundOn) {
      video.muted = true;
      setIsResultSoundOn(false);
      return;
    }

    video.muted = false;
    video.volume = 1;

    video
      .play()
      .then(() => {
        setIsResultSoundOn(!video.muted && video.volume > 0);
      })
      .catch(() => {
        video.muted = true;
        setIsResultSoundOn(false);
      });
  }

  function clamp(value, min, max) {
    if (Number.isNaN(value)) {
      return min;
    }

    return Math.min(Math.max(value, min), max);
  }

  function getMaxTileTypes(rows, cols) {
    return Math.min(MAX_TILE_TYPES, Math.floor((rows * cols) / 2));
  }

  function cloneBoard(board) {
    return board.map((row) => [...row]);
  }

  function normalizePoint(point) {
    if (!point) {
      return null;
    }

    const row = Number(point.row);
    const col = Number(point.col);

    if (!Number.isInteger(row) || !Number.isInteger(col)) {
      return null;
    }

    return { row, col };
  }

  function samePoint(a, b) {
    return Boolean(a && b && a.row === b.row && a.col === b.col);
  }

  function normalizeBoardData(data) {
    if (!data || !Array.isArray(data.board) || data.board.length === 0) {
      throw new Error("Invalid board data from server.");
    }

    const board = data.board.map((row) => row.map((value) => Number(value)));
    const rows = board.length;
    const cols = board[0].length;
    const remainingPairs = countRemainingPairs(board);

    return {
      ...data,
      rows,
      cols,
      board,
      remainingPairs: data.remainingPairs ?? remainingPairs,
      solved: data.solved ?? remainingPairs === 0,
    };
  }

  function countRemainingPairs(board) {
    let nonEmptyCells = 0;

    for (const row of board) {
      for (const value of row) {
        if (value !== 0) {
          nonEmptyCells += 1;
        }
      }
    }

    return Math.floor(nonEmptyCells / 2);
  }

  function isInsideBoard(board, point) {
    return (
      point &&
      point.row >= 0 &&
      point.row < board.length &&
      point.col >= 0 &&
      point.col < board[0].length
    );
  }

  function getBoardValue(board, point) {
    if (!isInsideBoard(board, point)) {
      return 0;
    }

    return board[point.row][point.col];
  }

  function removePairLocally(currentBoardData, from, to) {
    const nextBoard = cloneBoard(currentBoardData.board);

    nextBoard[from.row][from.col] = 0;
    nextBoard[to.row][to.col] = 0;

    const remainingPairs = countRemainingPairs(nextBoard);

    return {
      ...currentBoardData,
      rows: nextBoard.length,
      cols: nextBoard[0].length,
      board: nextBoard,
      solved: remainingPairs === 0,
      remainingPairs,
    };
  }

  function shuffleArray(values) {
    const shuffled = [...values];

    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  function shuffleRemainingTiles(currentBoardData) {
    const nextBoard = cloneBoard(currentBoardData.board);
    const positions = [];
    const values = [];

    for (let row = 0; row < nextBoard.length; row += 1) {
      for (let col = 0; col < nextBoard[row].length; col += 1) {
        const value = nextBoard[row][col];

        if (value !== 0) {
          positions.push({ row, col });
          values.push(value);
        }
      }
    }

    const shuffledValues = shuffleArray(values);

    positions.forEach((position, index) => {
      nextBoard[position.row][position.col] = shuffledValues[index];
    });

    const remainingPairs = countRemainingPairs(nextBoard);

    return {
      ...currentBoardData,
      rows: nextBoard.length,
      cols: nextBoard[0].length,
      board: nextBoard,
      solved: remainingPairs === 0,
      remainingPairs,
    };
  }

  function normalizeHint(hint) {
    if (!hint || !hint.hasHint) {
      return null;
    }

    const from = normalizePoint(hint.from);
    const to = normalizePoint(hint.to);

    if (!from || !to || samePoint(from, to)) {
      return null;
    }

    return { from, to };
  }

  async function getAvailableHint(board) {
    const hint = await getHint(board);
    return normalizeHint(hint);
  }

  async function ensureBoardHasMove(currentBoardData, maxAttempts = MAX_SHUFFLE_ATTEMPTS) {
    if (!currentBoardData || currentBoardData.solved) {
      return {
        boardData: currentBoardData,
        hint: null,
        shuffled: false,
      };
    }

    const currentHint = await getAvailableHint(currentBoardData.board);

    if (currentHint) {
      return {
        boardData: currentBoardData,
        hint: currentHint,
        shuffled: false,
      };
    }

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const shuffledBoardData = shuffleRemainingTiles(currentBoardData);
      const shuffledHint = await getAvailableHint(shuffledBoardData.board);

      if (shuffledHint) {
        return {
          boardData: shuffledBoardData,
          hint: shuffledHint,
          shuffled: true,
        };
      }
    }

    return {
      boardData: currentBoardData,
      hint: null,
      shuffled: false,
    };
  }

  function buildResultPayload(result, reason, boardSnapshot, finalScoreValue) {
    const finishedAtMs = Date.now();
    const startedAtMs = gameStartedAtRef.current || finishedAtMs;
    const snapshot = boardSnapshot || boardData;
    const remainingPairs = snapshot
      ? snapshot.remainingPairs ?? countRemainingPairs(snapshot.board)
      : 0;
    const safeTotalPairs = Math.max(totalPairs, remainingPairs);
    const safeClearedPairs = Math.max(0, safeTotalPairs - remainingPairs);

    return {
      playerName: playerName.trim() || "Guest",
      difficulty,
      difficultyLabel: currentMode.label,
      rowsCount: currentMode.rows,
      colsCount: currentMode.cols,
      tileTypes: currentMode.tileTypes,
      totalPairs: safeTotalPairs,
      clearedPairs: safeClearedPairs,
      helpUsed: helpUsedRef.current,
      finalScore: Math.max(0, finalScoreValue ?? finalScoreRef.current),
      result,
      resultReason: reason,
      timeLimitSeconds: isTimedMode ? currentTimeLimitSeconds : 0,
      timeLeftSeconds: isTimedMode ? Math.max(0, timeLeftRef.current) : 0,
      playDurationSeconds: Math.max(0, Math.floor((finishedAtMs - startedAtMs) / 1000)),
      startedAt: new Date(startedAtMs).toISOString(),
      finishedAt: new Date(finishedAtMs).toISOString(),
    };
  }

  function persistGameResult(result, reason, boardSnapshot, finalScoreValue) {
    if (savedResultRef.current) {
      return;
    }

    savedResultRef.current = true;
    const payload = buildResultPayload(result, reason, boardSnapshot, finalScoreValue);

    saveGameResult(payload).catch((error) => {
      savedResultRef.current = false;
      console.error("Cannot save game result.", error);
    });
  }

  function finishGame(result, reason, nextMessage, options = {}) {
    const finalScoreValue = options.finalScore ?? finalScoreRef.current;

    setResultReason(reason);
    setGameResult(result);
    setMessage(nextMessage);
    persistGameResult(result, reason, options.boardData || boardData, finalScoreValue);
  }

  function handleCustomRowsChange(e) {
    const value = clamp(Number(e.target.value), 2, 20);
    const newMaxTileTypes = getMaxTileTypes(value, customCols);

    setCustomRows(value);

    if (customTileTypes > newMaxTileTypes) {
      setCustomTileTypes(newMaxTileTypes);
    }
  }

  function handleCustomColsChange(e) {
    const value = clamp(Number(e.target.value), 2, 20);
    const newMaxTileTypes = getMaxTileTypes(customRows, value);

    setCustomCols(value);

    if (customTileTypes > newMaxTileTypes) {
      setCustomTileTypes(newMaxTileTypes);
    }
  }

  function handleCustomTileTypesChange(e) {
    const maxTileTypes = getMaxTileTypes(customRows, customCols);
    const value = clamp(Number(e.target.value), 1, maxTileTypes);

    setCustomTileTypes(value);
  }

  async function startGame() {
    try {
      const data = await generateBoard(
        currentMode.rows,
        currentMode.cols,
        currentMode.tileTypes
      );

      const normalizedBoardData = normalizeBoardData(data);
      const prepared = await ensureBoardHasMove(normalizedBoardData);
      const initialTotalPairs = countRemainingPairs(prepared.boardData.board);

      setBoardData(prepared.boardData);
      resetScoreState(initialTotalPairs);
      setSelectedTiles([]);

      setHintTiles([]);
      setPathPoints([]);
      const initialTimeLeft = isCustomMode ? 0 : currentTimeLimitSeconds;
      timeLeftRef.current = initialTimeLeft;
      setTimeLeft(initialTimeLeft);
      setHelpUsesLeft(isCustomMode ? Infinity : MAX_HELP_USES);
      setGameResult(null);
      setResultReason(null);
      setIsResultSoundOn(false);
      setResultVideoFailed(false);
      gameStartedAtRef.current = Date.now();
      savedResultRef.current = false;
      helpUsedRef.current = 0;
      finalScoreRef.current = 0;
      setMessage(prepared.shuffled ? "Game started. Board was reshuffled." : "Game started.");
      setScreen("GAME");
    } catch (error) {
      console.error(error);
      setMessage("Cannot generate board.");
    }
  }

  function backToStart() {
    setScreen("START");
    setBoardData(null);
    setSelectedTiles([]);
    setHintTiles([]);
    setPathPoints([]);
    setMessage("Choose a mode and start the game.");
    setIsSolving(false);
    setGameResult(null);
    setResultReason(null);
    setIsResultSoundOn(false);
    setResultVideoFailed(false);
    resetScoreState(0);
    gameStartedAtRef.current = null;
    savedResultRef.current = false;
    helpUsedRef.current = 0;
    timeLeftRef.current = TIMER_SECONDS;
    setTimeLeft(TIMER_SECONDS);
    setHelpUsesLeft(MAX_HELP_USES);
  }

  async function handleTileClick(tile) {
    if (!boardData || isGameLocked) {
      return;
    }

    const clickedPoint = normalizePoint(tile);
    if (!clickedPoint) {
      return;
    }

    const clickedValue = getBoardValue(boardData.board, clickedPoint);
    if (clickedValue === 0) {
      return;
    }

    const clickedTile = {
      row: clickedPoint.row,
      col: clickedPoint.col,
      value: clickedValue,
    };

    setHintTiles([]);
    setPathPoints([]);

    if (selectedTiles.length === 0) {
      setSelectedTiles([clickedTile]);
      return;
    }

    const firstTile = selectedTiles[0];
    const firstValue = getBoardValue(boardData.board, firstTile);

    if (samePoint(firstTile, clickedTile)) {
      setSelectedTiles([]);
      return;
    }

    if (firstValue === 0) {
      setSelectedTiles([clickedTile]);
      return;
    }

    if (firstValue !== clickedValue) {
      setSelectedTiles([clickedTile]);
      setMessage("Choose two identical tiles.");
      return;
    }

    try {
      const result = await checkMatch(boardData.board, firstTile, clickedTile);

      if (!result.valid) {
        setSelectedTiles([]);
        setMessage("Invalid move.");
        return;
      }

      const path = (result.path || []).map(normalizePoint).filter(Boolean);

      setSelectedTiles([firstTile, clickedTile]);
      setPathPoints(path);

      await sleep(160);

      await removePair(boardData.board, firstTile, clickedTile);

      const scoreResult = awardMatchScore();
      const scoreMessage = `+${scoreResult.points} points${
        scoreResult.streak > 1 ? ` · Combo x${scoreResult.streak}` : ""
      }.`;

      const updatedBoardData = removePairLocally(boardData, firstTile, clickedTile);

      if (updatedBoardData.solved) {
        setBoardData(updatedBoardData);
        setSelectedTiles([]);
        setPathPoints([]);
        finishGame("WIN", "PLAYER_WIN", `You win! ${scoreMessage}`, {
          boardData: updatedBoardData,
          finalScore: finalScoreRef.current,
        });
        return;
      }

      const prepared = await ensureBoardHasMove(updatedBoardData);

      setBoardData(prepared.boardData);
      setSelectedTiles([]);
      setPathPoints([]);

      if (prepared.shuffled) {
        setMessage(`${scoreMessage} Board reshuffled because no move was available.`);
      } else {
        setMessage(scoreMessage);
      }

    } catch (error) {
      console.error(error);
      setMessage("Move failed.");
      setSelectedTiles([]);
      setPathPoints([]);
    }
  }

  async function handleHelp() {
    if (!boardData || isGameLocked) {
      return;
    }

    if (!isHelpAvailable) {
      setHintTiles([]);
      setSelectedTiles([]);
      setPathPoints([]);
      setMessage("No helps left.");
      return;
    }

    try {
      setPathPoints([]);
      setSelectedTiles([]);

      const prepared = await ensureBoardHasMove(boardData);

      if (!prepared.hint) {
        setHintTiles([]);
        setMessage("No available move. Try starting a new board.");
        return;
      }

      const nextHelpUsesLeft = hasHelpLimit
        ? Math.max(0, helpUsesLeft - 1)
        : helpUsesLeft;

      setBoardData(prepared.boardData);
      setHintTiles([prepared.hint.from, prepared.hint.to]);

      helpUsedRef.current += 1;

      if (hasHelpLimit) {
        setHelpUsesLeft(nextHelpUsesLeft);
      }

      const baseMessage = prepared.shuffled ? "Board reshuffled. Help shown." : "Help shown.";
      const helpMessage = hasHelpLimit
        ? ` ${nextHelpUsesLeft} help${nextHelpUsesLeft === 1 ? "" : "s"} left.`
        : "";

      setMessage(`${baseMessage}${helpMessage}`);
    } catch (error) {
      console.error(error);
      setMessage("Cannot get help.");
    }
  }

  async function handleSolve() {
    if (!boardData || isGameLocked) {
      return;
    }

    try {
      setIsSolving(true);
      setSelectedTiles([]);
      setHintTiles([]);
      setPathPoints([]);
      setMessage("Solving...");

      let currentBoardData = boardData;
      const maxIterations = countRemainingPairs(currentBoardData.board) + 200;
      let iterations = 0;
      let usedShuffle = false;

      while (!currentBoardData.solved && iterations < maxIterations) {
        if (isTimedMode && timeLeftRef.current <= 0) {
          setMessage("Time is up!");
          break;
        }

        iterations += 1;

        const prepared = await ensureBoardHasMove(currentBoardData);
        currentBoardData = prepared.boardData;

        if (prepared.shuffled) {
          usedShuffle = true;
          setBoardData(currentBoardData);
          await sleep(120);
        }

        if (!prepared.hint) {
            setMessage("Solver cannot find any available move.");
          return;
        }

        const from = prepared.hint.from;
        const to = prepared.hint.to;
        const match = await checkMatch(currentBoardData.board, from, to);

        if (!match.valid) {
          currentBoardData = shuffleRemainingTiles(currentBoardData);
          usedShuffle = true;
          setBoardData(currentBoardData);
          await sleep(120);
          continue;
        }

        const path = (match.path || []).map(normalizePoint).filter(Boolean);

        setSelectedTiles([from, to]);
        setPathPoints(path);

        await sleep(170);

        await removePair(currentBoardData.board, from, to);

        const updatedBoardData = removePairLocally(currentBoardData, from, to);

        currentBoardData = updatedBoardData;
        setBoardData(updatedBoardData);

        await sleep(50);

        setSelectedTiles([]);
        setPathPoints([]);
      }

      if (currentBoardData.solved) {
        finishGame(
          "LOSE",
          "AUTO_SOLVE",
          usedShuffle
            ? "Auto solve finished the board after reshuffling. This counts as a loss."
            : "Auto solve finished the board. This counts as a loss.",
          { boardData: currentBoardData }
        );
      } else if (isTimedMode && timeLeftRef.current <= 0) {
        finishGame("LOSE", "TIME_UP", "Time is up!", { boardData: currentBoardData });
      } else {
        setMessage("Solver stopped to avoid an infinite loop.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Solve failed.");
    } finally {
      setIsSolving(false);
      setSelectedTiles([]);
      setHintTiles([]);
      setPathPoints([]);
    }
  }

  if (screen === "START") {
    const maxCustomTileTypes = getMaxTileTypes(customRows, customCols);

    const previewTiles = [
      "GPT",
      "Gem",
      "Clau",
      "Deep",
      "Grok",
      "Pilot",
      "Llama",
      "Qwen",
      "Pika",
      "Sora",
      "Run",
      "AI",
    ];

    return (
      <div className="start-screen">
        <StartLogoRain />
        <div className="start-orb start-orb-left" />
        <div className="start-orb start-orb-right" />

        <div className="start-card">
          <section className="start-content">
            <div className="start-badge">AI Logo Puzzle</div>

            <h1 className="start-title">Pikachuchu</h1>

            <p className="start-subtitle">
              Do you have good eyes enough to earn my winning flag?
            </p>

            <div className="start-form-group">
              <label htmlFor="player-name">Player name</label>
              <input
                id="player-name"
                type="text"
                placeholder="A nickname reminds me of you"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
            </div>

            <div className="difficulty-section">
              <div className="section-label">Difficulty</div>

              <div className="difficulty-grid">
                {Object.entries(DIFFICULTY_PRESETS).map(([key, preset]) => (
                  <button
                    key={key}
                    type="button"
                    className={`difficulty-card ${
                      difficulty === key ? "difficulty-card-active" : ""
                    }`}
                    onClick={() => setDifficulty(key)}
                  >
                    <span>{preset.label}</span>
                    <small>
                      {preset.rows}x{preset.cols} · {preset.tileTypes} types ·{" "}
                      {formatTime(TIMER_CONFIG[key]?.timeLimitSeconds ?? TIMER_SECONDS)}
                    </small>
                  </button>
                ))}

                <button
                  type="button"
                  className={`difficulty-card ${
                    isCustomMode ? "difficulty-card-active" : ""
                  }`}
                  onClick={() => setDifficulty("CUSTOM")}
                >
                  <span>Custom</span>
                  <small>
                    {customRows}x{customCols} · {customTileTypes} types
                  </small>
                </button>
              </div>
            </div>

            {isCustomMode && (
              <div className="custom-mode-box">
                <div className="start-form-group">
                  <label htmlFor="custom-rows">Rows</label>
                  <input
                    id="custom-rows"
                    type="number"
                    min="2"
                    max="20"
                    value={customRows}
                    onChange={handleCustomRowsChange}
                  />
                </div>

                <div className="start-form-group">
                  <label htmlFor="custom-cols">Cols</label>
                  <input
                    id="custom-cols"
                    type="number"
                    min="2"
                    max="20"
                    value={customCols}
                    onChange={handleCustomColsChange}
                  />
                </div>

                <div className="start-form-group">
                  <label htmlFor="custom-tile-types">Tile Types</label>
                  <input
                    id="custom-tile-types"
                    type="number"
                    min="1"
                    max={maxCustomTileTypes}
                    value={customTileTypes}
                    onChange={handleCustomTileTypesChange}
                  />
                  <small>Max: {maxCustomTileTypes}</small>
                </div>
              </div>
            )}

            <div className="mode-info">
              <p>
                <span>Rows</span>
                <strong>{currentMode.rows}</strong>
              </p>
              <p>
                <span>Cols</span>
                <strong>{currentMode.cols}</strong>
              </p>
              <p>
                <span>Types</span>
                <strong>{currentMode.tileTypes}</strong>
              </p>
            </div>

            <div className="start-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  alert(
                    "Rule: Connect two identical AI logos. The path can have at most 2 turns."
                  )
                }
              >
                How to play
              </button>

              <button type="button" className="primary-button" onClick={startGame}>
                Start Game
              </button>
            </div>

            <p className="start-message">{message}</p>
          </section>

          <aside className="preview-panel">
            <div className="preview-panel-header">
              <span className="preview-dot" />
              <span className="preview-dot" />
              <span className="preview-dot" />
            </div>

            <div className="preview-copy">
              <p>Live board preview</p>
              <h2>Match fast. Think smart.</h2>
            </div>

            <div className="preview-grid" aria-hidden="true">
              {previewTiles.map((tile, index) => (
                <div className="preview-tile" key={`${tile}-${index}`}>
                  {tile}
                </div>
              ))}
            </div>

            <div className="preview-marquee" aria-hidden="true">
              <div className="preview-marquee-row preview-marquee-row-right preview-marquee-speed-1">
                <div className="preview-marquee-track">
                  <span>⚡ 3-line path rule</span>
                  <span>🧠 AI logo set</span>
                  <span>🔥 Combo streak</span>
                  <span>⏱ Beat the timer</span>
                  <span>🎯 Match fast</span>
                  <span>🚀 Clear the board</span>

                  <span>⚡ 3-line path rule</span>
                  <span>🧠 AI logo set</span>
                  <span>🔥 Combo streak</span>
                  <span>⏱ Beat the timer</span>
                  <span>🎯 Match fast</span>
                  <span>🚀 Clear the board</span>
                </div>
              </div>

              <div className="preview-marquee-row preview-marquee-row-left preview-marquee-speed-2">
                <div className="preview-marquee-track">
                  <span>🏆 Earn the flag</span>
                  <span>✨ Smart eyes only</span>
                  <span>🤖 GPT vs Gemini</span>
                  <span>🌀 Find hidden pairs</span>
                  <span>💎 No wasted clicks</span>
                  <span>🧩 Puzzle mode on</span>

                  <span>🏆 Earn the flag</span>
                  <span>✨ Smart eyes only</span>
                  <span>🤖 GPT vs Gemini</span>
                  <span>🌀 Find hidden pairs</span>
                  <span>💎 No wasted clicks</span>
                  <span>🧩 Puzzle mode on</span>
                </div>
              </div>

              <div className="preview-marquee-row preview-marquee-row-right preview-marquee-speed-3">
                <div className="preview-marquee-track">
                  <span>⚔️ Hard mode ready</span>
                  <span>🎮 Arcade AI match</span>
                  <span>👀 Good eyes win</span>
                  <span>🔐 Unlock victory</span>
                  <span>🌈 Colorful logo hunt</span>
                  <span>🧭 Plan your path</span>

                  <span>⚔️ Hard mode ready</span>
                  <span>🎮 Arcade AI match</span>
                  <span>👀 Good eyes win</span>
                  <span>🔐 Unlock victory</span>
                  <span>🌈 Colorful logo hunt</span>
                  <span>🧭 Plan your path</span>
                </div>
              </div>

              <div className="preview-marquee-row preview-marquee-row-left preview-marquee-speed-4">
                <div className="preview-marquee-track">
                  <span>💥 Chain the matches</span>
                  <span>🧠 Think before click</span>
                  <span>⚡ Fast hands win</span>
                  <span>🎯 Zero mistake run</span>
                  <span>🏁 Finish before time</span>
                  <span>🕹 AI puzzle challenge</span>

                  <span>💥 Chain the matches</span>
                  <span>🧠 Think before click</span>
                  <span>⚡ Fast hands win</span>
                  <span>🎯 Zero mistake run</span>
                  <span>🏁 Finish before time</span>
                  <span>🕹 AI puzzle challenge</span>
                </div>
              </div>

              <div className="preview-marquee-row preview-marquee-row-right preview-marquee-speed-5">
                <div className="preview-marquee-track">
                  <span>🧬 Solver brain active</span>
                  <span>💡 Hint wisely</span>
                  <span>🌟 Clean board energy</span>
                  <span>🧨 Combo explosion</span>
                  <span>🔎 Spot the route</span>
                  <span>🎲 Every board is different</span>

                  <span>🧬 Solver brain active</span>
                  <span>💡 Hint wisely</span>
                  <span>🌟 Clean board energy</span>
                  <span>🧨 Combo explosion</span>
                  <span>🔎 Spot the route</span>
                  <span>🎲 Every board is different</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  const timerPercent =
    isTimedMode && currentTimeLimitSeconds > 0
      ? (timeLeft / currentTimeLimitSeconds) * 100
      : 0;
  const timerTone = isTimedMode ? getTimerTone(timeLeft) : "normal";
  const remainingPairs = boardData
    ? boardData.remainingPairs ?? countRemainingPairs(boardData.board)
    : 0;
  const clearedPairs = Math.max(0, totalPairs - remainingPairs);
  const progressPercent = totalPairs > 0 ? (clearedPairs / totalPairs) * 100 : 0;
  const progressTone = getProgressTone(progressPercent);

  return (
    <div className={`game-screen ${isTimedMode ? "" : "game-screen-no-timer"}`}>
      {isTimedMode && (
        <aside className="game-timer-panel" aria-label="Time left">
          <div className="timer-title">Time</div>

          <div className="timer-stack">
            <div className={`timer-bar timer-bar-${timerTone}`}>
              <div
                className="timer-fill"
                style={{
                  height: `${timerPercent}%`,
                  "--timer-width": `${timerPercent}%`,
                }}
              />
            </div>

            {comboBurst && (
              <div
                key={comboBurst.id}
                className={`combo-burst combo-burst-${comboBurst.text.replaceAll(" ", "-")}`}
                onAnimationEnd={() => setComboBurst(null)}
              >
                {comboBurst.text}
              </div>
            )}
          </div>

          <div className="combo-window" aria-label="Combo window">
            <div className="combo-window-label">Combo</div>
            <div className="combo-window-track">
              <div
                className="combo-window-fill"
                style={{
                  height: `${comboWindowPercent}%`,
                }}
              />
            </div>
          </div>

          <div className="timer-clock">{formatTime(timeLeft)}</div>
        </aside>
      )}

      <main className="game-main-area">
        <div className="game-board-only">
          <Board
            boardData={boardData}
            selectedTiles={selectedTiles}
            hintTiles={hintTiles}
            pathPoints={pathPoints}
            onTileClick={handleTileClick}
          />
        </div>

        <div className="game-message">{message}</div>
      </main>

      <aside className="game-side-panel">
        <div className="game-side-header">
          <h1>Pikachu</h1>
          <p>Player: {playerName.trim() || "Guest"}</p>
          <p>Mode: {currentMode.label}</p>
          <p>
            Helps: {hasHelpLimit ? `${helpUsesLeft}/${MAX_HELP_USES}` : "Unlimited"}
          </p>
        </div>

        <div className="score-hud">
          <div className="score-card">
            <span>Score</span>
            <strong>{score}</strong>
          </div>

          <div className={`score-card combo-card ${comboStreak > 1 ? "combo-card-active" : ""}`}>
            <span>Combo</span>
            <strong>{comboStreak > 1 ? `x${comboStreak}` : "-"}</strong>
          </div>
        </div>

        <div className={`progress-card progress-card-${progressTone}`}>
          <div className="progress-top">
            <span>Progress</span>
            <strong>
              {clearedPairs} {formatPairLabel(clearedPairs)} / {totalPairs} {formatPairLabel(totalPairs)}
            </strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${progressPercent}%`,
              }}
            />
          </div>

          <div className="progress-percent">{Math.round(progressPercent)}% cleared</div>
        </div>

        <div className={`help-status ${hasHelpLimit && helpUsesLeft === 0 ? "help-status-empty" : ""}`}>
          {hasHelpLimit
            ? `${helpUsesLeft} help${helpUsesLeft === 1 ? "" : "s"} remaining`
            : "Custom mode: unlimited helps"}
        </div>

        <div className="game-actions">
          <button
            className="secondary-button"
            onClick={handleHelp}
            disabled={isGameLocked || !isHelpAvailable}
          >
            Help
          </button>

          <button
            className="primary-button"
            onClick={handleSolve}
            disabled={isGameLocked}
          >
            {isSolving ? "Solving..." : "Solve"}
          </button>

          <button className="secondary-button" onClick={backToStart}>
            Menu
          </button>
        </div>
      </aside>

      {gameResult && (
        <div className={`result-overlay ${gameResult === "WIN" ? "result-win" : "result-lose"}`}>
          <div className="result-card">
            <div className="result-burst" aria-hidden="true">
              <span>✦</span>
              <span>✦</span>
              <span>✦</span>
              <span>✦</span>
              <span>✦</span>
              <span>✦</span>
            </div>

            {!resultVideoFailed ? (
              <div className={`result-video-wrap result-video-${resultVideoLayout}`}>
                <video
                  ref={resultVideoRef}
                  className="result-video"
                  src={RESULT_VIDEO_PATHS[gameResult]}
                  autoPlay
                  muted={!isResultSoundOn}
                  loop
                  playsInline
                  preload="auto"
                  onLoadedMetadata={updateResultVideoLayout}
                  onError={() => setResultVideoFailed(true)}
                  onVolumeChange={(event) => {
                    setIsResultSoundOn(!event.currentTarget.muted && event.currentTarget.volume > 0);
                  }}
                />

                <button
                  type="button"
                  className={`result-sound-button ${isResultSoundOn ? "result-sound-on" : ""}`}
                  onClick={toggleResultSound}
                >
                  {isResultSoundOn ? "🔇 Sound Off" : "🔊 Sound On"}
                </button>
              </div>
            ) : (
              <div className="result-icon" aria-hidden="true">
                {gameResult === "WIN" ? "🏆" : "⏰"}
              </div>
            )}

            <h2>{getResultTitle()}</h2>
            <p>{getResultMessage()}</p>

            {gameResult === "WIN" && (
              <div className="result-score">
                Final Score: <strong>{score}</strong>
              </div>
            )}

            <div className="result-actions">

              <button className="primary-button" onClick={startGame}>
                Play Again
              </button>
              <button className="secondary-button" onClick={backToStart}>
                Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GamePage;
