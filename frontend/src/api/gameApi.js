const DEFAULT_API_ROOT = "http://localhost:8080";
const configuredGameBaseUrl = import.meta.env.VITE_API_BASE_URL;
const configuredApiRoot = import.meta.env.VITE_API_ROOT;

const API_ROOT = configuredApiRoot ||
  (configuredGameBaseUrl
    ? configuredGameBaseUrl.replace(/\/api\/game\/?$/, "")
    : DEFAULT_API_ROOT);

const GAME_BASE_URL = configuredGameBaseUrl || `${API_ROOT}/api/game`;

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  return await response.json();
}

async function postJson(endpoint, body) {
  return requestJson(`${GAME_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

async function postApiJson(endpoint, body) {
  return requestJson(`${API_ROOT}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export function generateBoard(rows, cols, tileTypes) {
  return postJson("/generate", {
    rows,
    cols,
    tileTypes,
  });
}

export async function checkMatch(board, from, to) {
  const data = await postJson("/check-match", {
    board,
    fromRow: from.row,
    fromCol: from.col,
    toRow: to.row,
    toCol: to.col,
  });

  return {
    valid: data.matchable,
    matchable: data.matchable,
    turns: data.turns,
    path: data.path || [],
  };
}

export function removePair(board, from, to) {
  return postJson("/remove-pair", {
    board,
    fromRow: from.row,
    fromCol: from.col,
    toRow: to.row,
    toCol: to.col,
  });
}

export function getHint(board) {
  return postJson("/hint", {
    board,
  });
}

export function solveBoard(board, algorithm) {
  return postJson("/solve", {
    board,
    algorithm,
  });
}

export function saveGameResult(result) {
  return postApiJson("/api/results", result);
}

export function getGameResults() {
  return requestJson(`${API_ROOT}/api/results`);
}
