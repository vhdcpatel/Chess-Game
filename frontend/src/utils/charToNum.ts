export const charToNum = (char: string): number => {
  if (!char || char.length !== 1) return NaN;
  const upperChar = char.toUpperCase();
  const code = upperChar.charCodeAt(0);
  if (code < 65 || code > 90) return NaN; // A-Z is 65-90 in ASCII
  return code - 64;
}
