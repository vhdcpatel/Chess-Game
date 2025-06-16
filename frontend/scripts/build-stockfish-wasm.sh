#!/usr/bin/env bash
set -euo pipefail

# ————————————————
# Colors
# ————————————————
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}▶ Building Stockfish → WebAssembly${NC}"

# ————————————————
# Config
# ————————————————
REPO="https://github.com/official-stockfish/Stockfish.git"
CLONE_DIR="stockfish-wasm"
OUT_DIR="../public/stockfish"

# ————————————————
# Check emcc
# ————————————————
if ! command -v emcc &>/dev/null; then
  echo -e "${RED}✗ emcc (Emscripten) not found. Install from https://emscripten.org${NC}"
  exit 1
fi

# ————————————————
# Clone or update Stockfish
# ————————————————
if [ -d "$CLONE_DIR" ]; then
  echo -e "${YELLOW}↻ Updating Stockfish…${NC}"
  (cd "$CLONE_DIR" && git pull --ff-only)
else
  echo -e "${YELLOW}⎇ Cloning Stockfish…${NC}"
  git clone --depth 1 "$REPO" "$CLONE_DIR"
fi

# ————————————————
# Prepare output
# ————————————————
mkdir -p "$OUT_DIR"
cd "$CLONE_DIR/src"

# ————————————————
# Collect all .cpp
# ————————————————
SRC=( *.cpp )

echo -e "${YELLOW}ℹ️  Compiling ${#SRC[@]} source files…${NC}"

# ————————————————
# Build!
# ————————————————
emcc "${SRC[@]}" \
  -O3 \
  -s WASM=1 \
  -s MODULARIZE=1 \
  -s EXPORT_NAME="StockfishModule" \
  -s EXPORTED_FUNCTIONS='["_main"]' \
  -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap"]' \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s INITIAL_MEMORY=16MB \
  -s MAXIMUM_MEMORY=128MB \
  -U USE_NNUE \
  -U TABLEBASES \
  -DUSE_POPCNT=0 \
  -DNO_PREFETCH \
  -o "../../$OUT_DIR/stockfish.js"

echo -e "${GREEN}✔ Build complete!${NC}"
echo "  • $OUT_DIR/stockfish.js"
echo "  • $OUT_DIR/stockfish.wasm"
