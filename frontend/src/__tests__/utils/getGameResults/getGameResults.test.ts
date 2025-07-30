import { getGameResult } from "../../../components/chessBoard/GameOverDialog/getGameResult";

describe('getGameResult', () => {
  it('returns correct result for CheckMate (white turn)', () => {
    const result = getGameResult('CheckMate', 'w', null);
    expect(result.title).toBe('🏆 Game Over - Checkmate!');
    expect(result.message).toBe('Black wins by checkmate!');
    expect(result.resultClass).toBeDefined();
  });

  it('returns correct result for CheckMate (black turn)', () => {
  const result = getGameResult('CheckMate', 'b', null);
  expect(result.title).toBe('🏆 Game Over - Checkmate!');
  expect(result.message).toBe('White wins by checkmate!');
});

  it('returns correct result for Draw with reason', () => {
    const result = getGameResult('Draw', 'b', 'Repetition');
    expect(result.message).toBe('Repetition');
  });

  it('returns correct result for Draw without reason', () => {
  const result = getGameResult('Draw', 'w', null);
  expect(result.message).toBe('The game ends in a draw.');
});

  it("should return stalemate for application.", ()=>{
    const result = getGameResult('StaleMate','w');
    expect(result.title).toBe("🤝 Game Over - Stalemate!");
    expect(result.message).toBe("The game ends in a draw by stalemate.")

  })

  it('returns correct default result for unknown game state', () => {
    const result = getGameResult('Check', 'b'); // 'Check' not handled
    expect(result.title).toBe('🎯 Game Over');
  });
});
