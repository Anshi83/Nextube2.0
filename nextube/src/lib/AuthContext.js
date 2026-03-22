import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { useState, useEffect, useContext, createContext } from "react";
import { provider, auth } from "./firebase";
import axiosInstance from "./axiosinstance";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userdata) => {
    setUser(userdata);
    localStorage.setItem("user", JSON.stringify(userdata));
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("user");
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  const handlegooglesignin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const payload = {
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        image: firebaseUser.photoURL || "https://github.com/shadcn.png",
      };
      // ✅ Fixed — no double URL prefix
      const response = await axiosInstance.post("/user/login", payload);
      if (response.data && response.data.result) {
        login(response.data.result);
      }
    } catch (error) {
      console.error("Google sign in failed:", error);
    }
  };

  useEffect(() => {
    // ✅ Removed IP lookup entirely — was causing CORS errors
    // region/OTP logic can be added back later server-side
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const payload = {
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            image: firebaseUser.photoURL || "https://github.com/shadcn.png",
          };
          // ✅ Fixed — no double URL prefix
          const response = await axiosInstance.post("/user/login", payload);
          if (response.data?.result) {
            login(response.data.result);
          }
        } catch (error) {
          console.error("Auth state login failed:", error);
        }
      } else {
        logout();
      }
    });

    // ✅ Clean direct cleanup — no async wrapper needed
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout, handlegooglesignin }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);