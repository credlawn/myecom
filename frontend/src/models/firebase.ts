import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBXB--xizOKLI4dHOc5xvLJ33NhkY_VJi4",
  authDomain: "cipl-me.firebaseapp.com",
  projectId: "cipl-me",
  storageBucket: "cipl-me.firebasestorage.app",
  messagingSenderId: "880110295497",
  appId: "1:880110295497:web:445a10ab330eec8ecdf018",
};

const app = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
