import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBsKkK3SAMPLE",
  authDomain: "odyssey-dbe2a.firebaseapp.com",
  projectId: "odyssey-dbe2a",
  storageBucket: "odyssey-dbe2a.appspot.com",
  messagingSenderId: "597331861361",
  appId: "1:597331861361:web:f4cc3a107b920486d9a0d0"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)

export const auth = getAuth(app)