import { fsDB } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
export function getRandomString() {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
export async function checkusername(username, setvalid) {
  const docRef = doc(fsDB, "usernames", username);
  const docSnap = await getDoc(docRef);
  let NEWdata = docSnap.exists();
  if (username.length < 3) {
    setvalid(false);
  } else if (username.length >= 3) {
    setvalid(!NEWdata);
  }
}
