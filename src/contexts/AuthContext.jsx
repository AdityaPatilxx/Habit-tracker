// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { auth } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously as firebaseSignInAnonymously,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAnonymousSignInAttempted, setIsAnonymousSignInAttempted] =
    useState(false);

  async function signup(email, password) {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // Create a user document in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: userCredential.user.email,
      createdAt: serverTimestamp(),
      uid: userCredential.user.uid,
    });
    return userCredential;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // Create or update user document in Firestore
      await setDoc(
        doc(db, "users", result.user.uid),
        {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          lastLogin: serverTimestamp(),
          uid: result.user.uid,
        },
        { merge: true }
      );
      return result;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  }

  async function signInAnonymously() {
    try {
      const result = await firebaseSignInAnonymously(auth);
      // Create an anonymous user document in Firestore
      await setDoc(
        doc(db, "users", result.user.uid),
        {
          isAnonymous: true,
          createdAt: serverTimestamp(),
          uid: result.user.uid,
        },
        { merge: true }
      );
      return result;
    } catch (error) {
      console.error("Error signing in anonymously:", error);
      throw error;
    }
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user && !isAnonymousSignInAttempted) {
        setIsAnonymousSignInAttempted(true);
        try {
          await signInAnonymously();
        } catch (error) {
          console.error("Error signing in anonymously:", error);
          setLoading(false);
        }
      } else {
        setCurrentUser(user);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [isAnonymousSignInAttempted]);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    signInWithGoogle,
    signInAnonymously,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
