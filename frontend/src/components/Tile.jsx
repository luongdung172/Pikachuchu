import bloom from "../assets/bloom.png";
import characterAi from "../assets/character-ai.png";
import chatgpt from "../assets/chatgpt.png";
import claude from "../assets/claude.png";
import cody from "../assets/cody.png";
import commandR from "../assets/command-r.png";
import copilot from "../assets/copilot.png";
import cursor from "../assets/cursor.png";
import dalle from "../assets/dalle.png";
import deepseek from "../assets/deepseek.png";
import devin from "../assets/devin.png";
import doubao from "../assets/doubao.png";
import elevenlabs from "../assets/elevenlabs.png";
import ernie from "../assets/ernie.png";
import falcon from "../assets/falcon.png";
import gemini from "../assets/gemini.png";
import gemma from "../assets/gemma.png";
import grammarly from "../assets/grammarly.png";
import grok from "../assets/grok.png";
import hunyuan from "../assets/hunyuan.png";
import ideogram from "../assets/ideogram.png";
import kimi from "../assets/kimi.png";
import leonardo from "../assets/leonardo.png";
import llama from "../assets/llama.png";
import midjourney from "../assets/midjourney.png";
import mistral from "../assets/mistral.png";
import notion from "../assets/notion.png";
import perplexity from "../assets/perplexity.png";
import phi from "../assets/phi.png";
import pika from "../assets/pika.png";
import poe from "../assets/poe.png";
import qwen from "../assets/qwen.png";
import replit from "../assets/replit.png";
import runway from "../assets/runway.png";
import sora from "../assets/sora.png";
import stableDiffusion from "../assets/stable-diffusion.png";
import stablelm from "../assets/stablelm.png";
import suno from "../assets/suno.png";
import tabnine from "../assets/tabnine.png";
import udio from "../assets/udio.png";

const TILE_IMAGES = {
  1: chatgpt,
  2: gemini,
  3: claude,
  4: deepseek,
  5: grok,
  6: copilot,
  7: perplexity,
  8: llama,
  9: mistral,
  10: qwen,
  11: kimi,
  12: ernie,
  13: hunyuan,
  14: doubao,
  15: commandR,
  16: phi,
  17: gemma,
  18: falcon,
  19: bloom,
  20: stablelm,
  21: midjourney,
  22: dalle,
  23: stableDiffusion,
  24: leonardo,
  25: ideogram,
  26: runway,
  27: pika,
  28: sora,
  29: elevenlabs,
  30: suno,
  31: udio,
  32: cursor,
  33: replit,
  34: cody,
  35: tabnine,
  36: devin,
  37: notion,
  38: grammarly,
  39: characterAi,
  40: poe,
};

const TILE_NAMES = {
  1: "ChatGPT",
  2: "Gemini",
  3: "Claude",
  4: "DeepSeek",
  5: "Grok",
  6: "Copilot",
  7: "Perplexity",
  8: "Llama",
  9: "Mistral",
  10: "Qwen",
  11: "Kimi",
  12: "ERNIE",
  13: "Hunyuan",
  14: "Doubao",
  15: "Command R",
  16: "Phi",
  17: "Gemma",
  18: "Falcon",
  19: "BLOOM",
  20: "StableLM",
  21: "Midjourney",
  22: "DALL·E",
  23: "Stable Diffusion",
  24: "Leonardo AI",
  25: "Ideogram",
  26: "Runway",
  27: "Pika",
  28: "Sora",
  29: "ElevenLabs",
  30: "Suno",
  31: "Udio",
  32: "Cursor",
  33: "Replit AI",
  34: "Cody",
  35: "Tabnine",
  36: "Devin",
  37: "Notion AI",
  38: "Grammarly",
  39: "Character AI",
  40: "Poe",
};

function Tile({
  row,
  col,
  value,
  totalRows,
  totalCols,
  isSelected,
  isHint,
  onTileClick,
}) {
  const isBorder =
    row === 0 ||
    col === 0 ||
    row === totalRows - 1 ||
    col === totalCols - 1;

  const isEmpty = value === 0;

  let className = "tile";

  if (isBorder) {
    className += " tile-border";
  }

  if (isEmpty) {
    className += " tile-empty";
  }

  if (isSelected) {
    className += " tile-selected";
  }

  if (isHint) {
    className += " tile-hint";
  }

  function handleClick() {
    if (isBorder || isEmpty) {
      return;
    }

    onTileClick({
      row,
      col,
      value,
    });
  }

  const tileImage = TILE_IMAGES[value];
  const tileName = TILE_NAMES[value] || `Tile ${value}`;

  return (
    <button
      className={className}
      data-row={row}
      data-col={col}
      disabled={isBorder || isEmpty}
      onClick={handleClick}
      title={tileName}
    >
      {!isEmpty && !isBorder && tileImage && (
        <img className="tile-image" src={tileImage} alt={tileName} />
      )}
    </button>
  );
}

export default Tile;