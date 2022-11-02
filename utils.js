function intervalInMillis(interval) {
  return interval * 24 * 3600000;
}

export function setTimer(interval) {
  const currentDate = Date.now();
  return currentDate + intervalInMillis(interval);
}

export function getTimeDiff(milliseconds) {
  const currentDate = Date.now();
  return milliseconds - currentDate;
}

export function getTimePerc(timeLeft, waterInterval) {
  const percents = (timeLeft / intervalInMillis(waterInterval)) * 100;
  return percents.toFixed(0);
}
