export function clampValue(value, min, max) {
  if (isNaN(value)) return min;
  return Math.max(min, Math.min(max, value));
}
