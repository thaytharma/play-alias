/** True while the countdown is in its final stretch (e.g. last 10s) but not yet finished. */
export function isTimeRunningOut(counter: number, threshold = 10): boolean {
  return counter > 0 && counter <= threshold;
}
