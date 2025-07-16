import { ChessState, GameStatus, TCapturePiecesRecords } from "./chessModel";

export const defaultStartFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export const InitialGameState: GameStatus = {
    turn: 'w',
    gameState: 'OnGoing',
    isGameOver: false,
}

export const InitialCapturePieces:TCapturePiecesRecords = {
    w: {},
    b: {}
}

// Set Multiplayer by default so don't load wasm.
export const initialState: ChessState = {
    player: 'w',
    isSinglePlayer: false,
    game: null,
    possibleMoves: [],
    gameState: InitialGameState,
    activePiece: null,
    history: [],
    promotionInfo: null,
    gameEndReason: null,
    stockFishState: null,
    capturedPieces: InitialCapturePieces,
};