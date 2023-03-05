import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, fsDB } from "./firebase";

// export
export const AppContext = createContext();

// context function
const ContextNext = ({ children }) => {
  // user of google to get the auth from
  const [user, setuser] = useState(null);
  // user of the page to get {name , username , profile image}
  const [profileuser, setprofileuser] = useState(null);
  // to update the auth state on login click
  const [submitclicked, setsubmitclicked] = useState(false);
  //
  const [admin, setadmin] = useState({
    present: false,
    id: null,
  });

  const getUserData = async (googleuser) => {
    const docRef = doc(fsDB, "users", googleuser?.uid);
    const docSnap = await getDoc(docRef);
    const userData = docSnap.data();
    if (userData?.username) {
      setadmin((old) => ({ ...old, id: googleuser.uid, present: true }));
      setprofileuser(userData);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (googleuser) => {
      if (googleuser) {
        console.log(googleuser.displayName, "logged in");
        setuser(googleuser);
        getUserData(googleuser);
      } else {
        console.log("no user logged in");
        setadmin((old) => ({ ...old, id: null, present: false }));
        setuser(null);
        setprofileuser(null);
      }
    });
  }, [auth, submitclicked]);

  return (
    <AppContext.Provider
      value={{
        user,
        setuser,
        profileuser,
        admin,
        setsubmitclicked,
        setprofileuser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default ContextNext;
