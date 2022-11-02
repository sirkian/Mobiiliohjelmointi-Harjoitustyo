import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDMBbUCB79tiXPqi9qc2bto3k6TOZktUA8",
  authDomain: "mobiili-harjoitustyo.firebaseapp.com",
  databaseURL: "https://mobiili-harjoitustyo-default-rtdb.firebaseio.com",
  projectId: "mobiili-harjoitustyo",
  storageBucket: "mobiili-harjoitustyo.appspot.com",
  messagingSenderId: "344720425893",
  appId: "1:344720425893:web:5d18dbca50528479e71e4c",
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
