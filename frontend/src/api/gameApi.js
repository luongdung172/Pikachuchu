const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/game";

async function postJson(endpoint, body) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  return await response.json();
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