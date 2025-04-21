import React from 'react'
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'

const get_firebase_config = () => {
  const req = new XMLHttpRequest()
  req.open("GET", "./assets/firebase_cfg.json", false)
  req.send()
  return JSON.parse(req.responseText)
}

const firebase_config = get_firebase_config()
const firebase_app = initializeApp(firebase_config)
const firebase_auth = getAuth(firebase_app)
const sign_in = async (email, password) => { await signInWithEmailAndPassword(firebase_auth, email, password)}
const sign_out = () => { signOut(firebase_auth) }

const on_auth_state_changed = (fn) => {
  return onAuthStateChanged(firebase_auth, (user) => {fn(user)})
}

const user_token = async () => {
  const token = await firebase_auth.currentUser.getIdToken()
  return token
}

export {
  on_auth_state_changed,
  sign_in,
  sign_out,
  user_token,
}
