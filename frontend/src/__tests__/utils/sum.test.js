import { describe } from "vitest";
import { getSum } from "../../utils/getSum";

describe("sum", () => {
  it("adds 1 + 2 to equal 3", () => {

    expect(getSum(1,2)).toBe(3);
  });
});