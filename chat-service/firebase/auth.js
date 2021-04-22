import axios from 'axios'
import { auth } from '.'

export function signInWithGoogle () {
  const provider = new auth.GoogleAuthProvider()
  return auth().signInWithPopup(provider)
}

export function signInWithFacebook () {
  const provider = new auth.FacebookAuthProvider()
  return auth().signInWithPopup(provider)
}

export function signInWithTwitter () {
  const provider = new auth.TwitterAuthProvider()
  return auth().signInWithPopup(provider)
}

export async function signInWithInstagram (token) {
  const fbUser = await auth().signInWithCustomToken(token)
  const { data } = await axios.get(
    'https://ws.omnisplayer.com/auth/instagram/me?access_token=' + token
  )

  return data
}

export function logout () {
  return auth().signOut()
}
