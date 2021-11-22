import firebase from 'firebase'

const firebaseConfig = firebase.initializeApp({
  apiKey: "AIzaSyAAM2bps5tq6QO7eiWfCqUNUdohcxVqkOs",
  authDomain: "hifi-cafe.firebaseapp.com",
  projectId: "hifi-cafe",
  storageBucket: "hifi-cafe.appspot.com",
  messagingSenderId: "981257175359",
  appId: "1:981257175359:web:d29fc6ef41c41167f2538a",
  measurementId: "G-9RH1ZQ62K6"
})

const storage = firebase.storage();
export {storage}
