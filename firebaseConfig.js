import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js"; // Importa Firebase Auth

const firebaseConfig = {
    apiKey: "AIzaSyAWqdjhFLTxJ6PNikGwfNB7VCkFP4UGSeA",
    authDomain: "fiufinder.firebaseapp.com",
    projectId: "fiufinder",
    storageBucket: "fiufinder.firebasestorage.app",
    messagingSenderId: "983224653968",
    appId: "1:983224653968:web:fbf386ba04d6c0fdd46015",
    measurementId: "G-EXWK2ZH1L1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };