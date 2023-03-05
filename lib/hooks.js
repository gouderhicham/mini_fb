import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth, fsDB } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
export function formDate(date) {
  let time = "";
  if (date.getHours() > 12) {
    time = "PM";
  } else {
    time = "AM";
  }
  return `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()} ${time}`;
}
export function SignOutButton() {
  return (
    <Link prefetch={false} href={"/signin"}>
      <button
        style={{ marginRight: 25 }}
        onClick={() => {
          signOut(auth)
            .then(() => {})
            .catch((error) => {
              console.log(error);
            });
        }}
      >
        Sign Out
      </button>
    </Link>
  );
}
export async function checkusername(username, setvalid, setloading) {
  const docRef = doc(fsDB, "usernames", username);
  const docSnap = await getDoc(docRef);
  let NEWdata = docSnap.exists();
  if (username.length < 3) {
    setvalid(false);
    setloading(false);
  } else if (username.length >= 3) {
    setvalid(!NEWdata);
    setloading(false);
  }
}
export function return_url(context) {
  if (process.env.NODE_ENV === "production") {
    return `https://${context.req.rawHeaders[1]}`;
  } else if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3000";
  }
}
