import { getGameResult } from "../../../components/chessBoard/GameOverDialog/getGameResult";

describe('getGameResult', () => {
  it('returns correct result for CheckMate (white turn)', () => {
    const result = getGameResult('CheckMate', 'w', null);
    expect(result.title).toBe('🏆 Game Over - Checkmate!');
    expect(result.message).toBe('Black wins by checkmate!');
    expect(result.resultClass).toBeDefined();
  });

  it('returns correct result for Draw with reason', () => {
    const result = getGameResult('Draw', 'b', 'Repetition');
    expect(result.message).toBe('Repetition');
  });

  it('returns correct default result for unknown game state', () => {
    const result = getGameResult('Check', 'b', null); // 'Check' not handled
    expect(result.title).toBe('🎯 Game Over');
  });
});
