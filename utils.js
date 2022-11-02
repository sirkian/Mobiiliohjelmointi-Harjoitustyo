const hourInMillis = 3600000;

function intervalInMillis(interval) {
  return interval * 24 * hourInMillis;
}

export function setTimer(interval) {
  const currentDate = Date.now();
  return currentDate + intervalInMillis(interval);
}

export function getTimeDiff(milliseconds) {
  const currentDate = Date.now();
  return milliseconds - currentDate;
}

export function getProgress(timeLeft, waterInterval) {
  const percents = (timeLeft / intervalInMillis(waterInterval)) * 100;
  return percents / 100;
}
