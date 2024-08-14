import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBCcjCa0N1nvZN1pCONtmOweBcUBYhTpSU",
  authDomain: "zap-mobile-71630.firebaseapp.com",
  projectId: "zap-mobile-71630",
  storageBucket: "zap-mobile-71630.appspot.com",
  messagingSenderId: "17528040277",
  appId: "1:17528040277:web:901b2b27a1719217c5dddc"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
