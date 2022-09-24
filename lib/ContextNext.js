import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, fsDB } from "./firebase";
// export
export const AppContext = createContext();
// context function
const ContextNext = ({ children }) => {
  const [user, setuser] = useState(null);
  const [profileuser, setprofileuser] = useState(null);
  const [submitclicked, setsubmitclicked] = useState(false);
  const [admin, setadmin] = useState({
    present: false,
    id: null,
  });
  useEffect(() => {
    onAuthStateChanged(auth, async (googleuser) => {
      if (googleuser) {
        console.log(googleuser.displayName, "logged in");
        setuser(googleuser);
        const docRef = doc(fsDB, "users", googleuser?.uid);
        const docSnap = await getDoc(docRef);
        const userData = docSnap.data();
        if (userData?.username) {
          setadmin((old) => ({ ...old, id: googleuser.uid, present: true }));
          setprofileuser(userData);
        }
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
      value={{ user, setuser, profileuser, admin, setsubmitclicked }}
    >
      {children}
    </AppContext.Provider>
  );
};
export default ContextNext;
