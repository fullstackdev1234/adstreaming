import axios from 'axios'
import { db } from '../firebase'
import io from 'socket.io-client'

const messaging = {}

const logger = console.log
const messagingApi = `${process.env.chatService.chatSIOHost}/${process.env.chatService.chatSIONamespace}`

let token = null
let socket = null
let _connected = false
let connectTimeout = null

// Just the SocketIO entrypoint and global handler
export function serviceConnect (msgCb, countCb, onConnect=()=>{}) {
  console.log('>>>>>>>>', messagingApi)
  socket = io(messagingApi, { transports: ['websocket', 'polling'] })
  socket.on('message', msgCb)
  socket.on('count', countCb)
  socket.on('connect', function() {
    logger('connected socket')
    _connected || onConnect()
    _connected = true

    // Is connected, clear the timeout
    // tracking disconnection
    clearTimeout(connectTimeout)
  })
  socket.on('disconnect', function() {
    logger('disconnected socket')
    // If after one minute did not reconnect
    // consider disconnected
    connectTimeout = setTimeout(() => {
      _connected = false
    }, 60 * 1000)
  })
  socket.on('connect_error', function (err) {
    logger('could not connect to socket', err)
  })
  socket.on('error', function (err) {
    logger('socket closed from error', err)
  })

}

// pull message index for eventId
export const loadMessageIndex = async eventId => {
  const url = `https://storage.googleapis.com/omnis-player-test.appspot.com/${eventId}.json`
  try {
    const { data } = await axios.get(url)
    const messageIndex = JSON.parse(JSON.stringify(data))
    return messageIndex
  } catch (e) {
    console.log('Error loading message index', e)
  }
}

// Pull chat history from Firestore
export const loadChatHistory = async () => {
  const chatMessages = []
  try {
    const { data } = await axios.get(`${process.env.chatService.chatSIOHost}/history`)
    data.forEach(m => chatMessages.unshift(m))
    return chatMessages
  } catch (e) {
    console.log('Error loading history', e)
  }
}

export const loadChatHistoryFromFireStore = async () => {
  const chatMessages = []
  try {
    const query = await db.collection('chat').orderBy('date', 'desc').limit(30).get()
    query.forEach(doc => {
      chatMessages.unshift(doc.data())
    })
  } catch (err) {
    console.log(err)
  }
  return chatMessages
}

// Get a token for this client to identify to FCM
async function getToken () {
  if (token) { return token }
  try {
    await messaging.requestPermission()
    token = await messaging.getToken()
    return token
  } catch (e) {
    // We assume this as failed messaging auth
  }
}

// Publish message directly to Firestore
// This will call a Cloud Function that in turn delivers
// messages to the Messaging Service
export function postMessage (post) {
  const msg = post
  db.collection('chat').add(msg)
    // .then(docRef => logger('Document written with ID: ', docRef.id))
    .catch(err => logger('Error adding document: ', err))
}

// Subscribe this client to receive Push Notifications
// from FCM
export async function subscribeToNotifications (topic) {
  try {
    const token = await getToken()
    await axios.post('https://us-central1-omnis-player-test.cloudfunctions.net/subscribeToTopic', {
      topic,
      token
    })
  } catch (e) {
    logger('Could not subscribe to notifications')
  }
}

// Binds notifications to UI callback. Handles receipt
// notifications to the UI App
export function onMessage (fn) {
  messaging.onMessage(fn)
}

// Load user photos from Firestore
export async function loadUsersPhotos () {
  try {
    const query = await db.collection('photos').get()
    const photos = {}
    query.forEach(doc => {
      const data = doc.data()
      photos[data.userId] = data.photoURL
    })
    return photos
  } catch (e) {
    console.log(e)
  }
}

// Save this user's photo into Firestore in case not there yet
export async function loadPhotoURL (userId, photoURL) {
  try {
    const query = await db.collection('photos')
      .where('userId', '==', userId).get()
    const photos = []
    query.forEach(doc => {
      photos.push(doc.data())
    })
    if (!photos.length) {
      db.collection('photos').add({ userId, photoURL })
    }
  } catch (e) {
    console.log(e)
  }
}
