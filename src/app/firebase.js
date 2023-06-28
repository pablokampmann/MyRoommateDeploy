import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getDatabase, get, ref as databaseRef } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBaNrCcQzERRrwx8XYANsg8Qx3TCG6dItY",
  authDomain: "myroommate-8ab49.firebaseapp.com",
  databaseURL: "https://myroommate-8ab49-default-rtdb.firebaseio.com",
  projectId: "myroommate-8ab49",
  storageBucket: "myroommate-8ab49.appspot.com",
  messagingSenderId: "115872336177",
  appId: "1:115872336177:web:6278c1f28ee8d31c89c810",
  measurementId: "G-J1H9FY3DPX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = ref(getDatabase(app));

export async function getUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (user) {
        let dbRef = databaseRef(db, 'users/' + user.uid);
        let snapshot = await get(dbRef);
        if (snapshot) {
          resolve(snapshot.val());
        }
      } else {
        reject(new Error("User not logged in"));
      }
    });
  });
}
