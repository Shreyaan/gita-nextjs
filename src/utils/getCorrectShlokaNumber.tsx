export function getCorrectShlokaNumber(
  currentShlokaNum: number
): [number, number] {
  const ranges = [
    47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78,
  ];
  let offset = 0;

  for (let i = 0; i < ranges.length; i++) {
    if (currentShlokaNum <= offset + ranges[i]) {
      return [i + 1, currentShlokaNum - offset - 1];
    }
    offset += ranges[i];
  }

  return [0, 0];
}
