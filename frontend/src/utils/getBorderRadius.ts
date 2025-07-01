import styles from '../components/square/Square.module.css';

export function getBorderRadius(rankIndex: number, fileIndex: number): string {
  const isTopLeft = rankIndex === 0 && fileIndex === 0;
  const isTopRight = rankIndex === 0 && fileIndex === 7;
  const isBottomLeft = rankIndex === 7 && fileIndex === 0;
  const isBottomRight = rankIndex === 7 && fileIndex === 7;

  if (isTopLeft) return styles['top-left-corner'];
  if (isTopRight) return styles['top-right-corner'];
  if (isBottomLeft) return styles['bottom-left-corner'];
  if (isBottomRight) return styles['bottom-right-corner'];

  return '';
}
