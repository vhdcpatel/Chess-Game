// charToNum.test.ts
import { charToNum } from "../../utils/charToNum";

describe('Convert char to num', () => {
  it('should return the correct number for uppercase letters', () => {
    expect(charToNum('A')).toBe(1);
    expect(charToNum('B')).toBe(2);
    expect(charToNum('C')).toBe(3);
    expect(charToNum('Z')).toBe(26);
  });

  it('should handle lowercase letters by converting them to uppercase', () => {
    expect(charToNum('a')).toBe(1);
    expect(charToNum('b')).toBe(2);
    expect(charToNum('c')).toBe(3);
    expect(charToNum('z')).toBe(26);
  });

  it('should return NaN for non-alphabetic characters', () => {
    expect(charToNum('1')).toBeNaN();
    expect(charToNum('!')).toBeNaN();
    expect(charToNum('@')).toBeNaN();
    expect(charToNum('[')).toBeNaN(); // character before 'A'
    expect(charToNum('`')).toBeNaN(); // character before 'a'
  });

  it('should handle empty strings', () => {
    expect(charToNum('')).toBeNaN();
  });
});
