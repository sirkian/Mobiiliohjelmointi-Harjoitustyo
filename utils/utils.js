import { ref, getStorage, deleteObject } from "firebase/storage";

const storage = getStorage();
const hourInMillis = 3600000;

const intervalInMillis = (interval) => {
  return interval * 24 * hourInMillis;
};

export const setTimer = (interval) => {
  return Date.now() + intervalInMillis(interval);
};

export const getTimeDiff = (milliseconds) => {
  return milliseconds - Date.now();
};

export const getProgress = (timeLeft, waterInterval) => {
  const percents = (timeLeft / intervalInMillis(waterInterval)) * 100;
  return percents / 100;
};

export const formatTime = (timeAfterInterval) => {
  if (Date.now() > timeAfterInterval) return "Time up.";

  let seconds = (timeAfterInterval - Date.now()) / 1000;
  let days = Math.floor(seconds / (24 * 60 * 60));
  seconds -= days * (24 * 60 * 60);
  let hours = Math.floor(seconds / (60 * 60));
  seconds -= hours * (60 * 60);
  let minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  return (
    (days > 0 ? days + " days, " : "") + hours + "hrs, " + minutes + "mins"
  );
};

export const deleteImageFromStorage = (imageUrl) => {
  const start = imageUrl.lastIndexOf("/");
  const end = imageUrl.lastIndexOf("?");
  const imageName = imageUrl.slice(start + 1, end);
  const imageRef = ref(storage, imageName);

  deleteObject(imageRef)
    .then(() => {
      console.log("Image deleted!");
    })
    .catch((error) => {
      console.log("Image delete failed ", error);
    });
};
