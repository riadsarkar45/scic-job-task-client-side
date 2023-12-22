import { GoogleAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import auth from "../Firebase";

export const AuthContext = createContext(null)
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true);
    const creatUser = (email, password) => {
        
        setIsLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
    }
    const signIn = (email, password) => {
        
        setIsLoading(true);
        return signInWithEmailAndPassword(auth, email, password)
    }
    const provider = new GoogleAuthProvider();
    const googleSignIn = () => {
        
        setIsLoading(true);
        return signInWithPopup(auth, provider)
    }
    const logOut = () => {
        
        setIsLoading(true);
        return signOut(auth)
    }
    const profileUpdate = (name, imageUrl) => {
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: imageUrl
        });
    };
    
    useEffect(() => {
        const unsubsCribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            setIsLoading(false);
        });
        return () => {
            return unsubsCribe;
        }
    }, [])
    const AuthInfo = { creatUser, signIn, user, googleSignIn, logOut, profileUpdate, isLoading };
    return (
        <AuthContext.Provider value={AuthInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;