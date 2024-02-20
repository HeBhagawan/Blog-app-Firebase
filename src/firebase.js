import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {getAuth , GoogleAuthProvider,FacebookAuthProvider,GithubAuthProvider} from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyC8FjyVWC_9wIMFgs2dWafe4-eTRDbmsW4",
  authDomain: "react-blog-page-6189c.firebaseapp.com",
  projectId: "react-blog-page-6189c",
  storageBucket: "react-blog-page-6189c.appspot.com",
  messagingSenderId: "159313456786",
  appId: "1:159313456786:web:bea03904b830c1efee404b",
};

const app = initializeApp(firebaseConfig);
const GoogleProvider = new GoogleAuthProvider(app)
const facebookProvider = new FacebookAuthProvider(app);
const GithubProvider = new GithubAuthProvider(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage,GoogleProvider,facebookProvider,GithubProvider} 
