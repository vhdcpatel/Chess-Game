import { Chess } from "chess.js";


export const downloadFenToTxt = (chess: Chess, filename = 'game_fen.txt') => {
  if (!chess || typeof chess.fen !== 'function') {
    console.error('Invalid Chess instance provided.');
    return;
  }

  const fen = chess.fen();
  const signature = '\n# Created by VHDC';
  const blob = new Blob([fen + signature], { type: 'text/plain;charset=utf-8' });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};
