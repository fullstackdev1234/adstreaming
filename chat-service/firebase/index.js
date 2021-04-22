import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
// import 'firebase/messaging'

const config = {
  apiKey: process.env.chatService.chatFirebaseApiKey,
  authDomain: process.env.chatService.chatFirebaseAuthDomain,
  databaseURL: process.env.chatService.chatFirebaseDataUrl,
  projectId: process.env.chatService.chatFirebaseProjectId,
  storageBucket: process.env.chatService.chatFirebaseStorageBucket,
  // messagingSenderId: process.env.GRIDSOME_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.chatService.chatFirebaseAppId,
  measurementId: process.env.chatService.chatFirebaseMeasurementId
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export const db = firebase.firestore()
export const auth = firebase.auth
// export const messaging = firebase.messaging()
