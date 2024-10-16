"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import the functions you need from the SDKs you need
const app_1 = require("firebase/app");
const lite_1 = require("firebase/firestore/lite");
const firebaseConfig = {
    apiKey: "AIzaSyADQ1FTZ26IT_P8hYZNZXadgoDXqvavJtE",
    authDomain: "subasta-afe97.firebaseapp.com",
    projectId: "subasta-afe97",
    storageBucket: "subasta-afe97.appspot.com",
    messagingSenderId: "32372181008",
    appId: "1:32372181008:web:1229fbce86d27ee0456295"
};
// Initialize Firebase
const app = (0, app_1.initializeApp)(firebaseConfig);
const db = (0, lite_1.getFirestore)(app);
exports.default = db;
