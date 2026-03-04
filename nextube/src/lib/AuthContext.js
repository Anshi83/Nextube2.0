import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import {  useState } from "react";
import { createContext } from "react";
import { provider, auth } from "./firebase";
import axiosInstance from "./axiosinstance";
import { useEffect, useContext } from "react";


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
      const response = await axiosInstance.post("/user/login", payload);
      if (response.data && response.data.result) {
        login(response.data.result);}
      } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
  
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            const payload = {
              email: firebaseUser.email,
              name: firebaseUser.displayName,
              image: firebaseUser.photoURL || "https://github.com/shadcn.png",
              region: data.region,
              mobileNumber: "9999999999",
            };
        
            const response = await axiosInstance.post("/user/login", payload);
        
            if (response.data?.result) {
              login(response.data.result);
            }
          } else {
            logout();
          }
        });
  
        return unsubscribe;
      } catch (error) {
        console.error("Region fetch failed:", error.message);
      }
    };
  
    let cleanup;
  
    initAuth().then((unsub) => {
      cleanup = unsub;
    });
  
    return () => {
      if (cleanup) cleanup();
    };
  }, []);
  return (
    <UserContext.Provider value={{ user, login, logout, handlegooglesignin }}>
      {children}
    </UserContext.Provider>
  );
};
export const useUser = () => useContext(UserContext);