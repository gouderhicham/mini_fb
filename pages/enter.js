import { auth, googleAuthProvider, fsDB } from "../lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../lib/ContextNext";
import useDebounce from "@clave/use-debounce";
import Link from "next/link";
import { setDoc, doc, getDoc } from "firebase/firestore";
const Enter = () => {
  const { user, profileuser, setsubmitclicked } = useContext(AppContext);
  useEffect(() => {
    setsubmitclicked(false);
  }, []);
  return (
    <main>
      {user ? (
        !profileuser?.username ? (
          <UsernameForm
            setsubmitclicked={setsubmitclicked}
            user={user}
            username={profileuser?.username}
          />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
};
export default Enter;
function UsernameForm({ user, username, setsubmitclicked }) {
  const [input, setinput] = useState("");
  const [valid, setvalid] = useState(false);
  const onChange = (e) => {
    let value = e.target.value.toLowerCase();
    setinput(value);
    setinput(value.toLowerCase());
  };
  async function onSubmit(e) {
    e.preventDefault();
    if (!valid) return;
    setsubmitclicked(true);
    await setDoc(doc(fsDB, "users", user.uid), {
      displayName: user.displayName,
      photoURL: user.photoURL,
      username: input.replace(/^\s+|\s+$/gm, ""),
    });
    await setDoc(doc(fsDB, `usernames`, input), {
      uid: user.uid,
    });
    console.log("user added");
    //NOTE:  =======================> :DONE
  }
  let delayedInput = useDebounce(input, 400);
  useEffect(() => {
    if (input.length > 0) {
      checkusername(delayedInput.replace(/^\s+|\s+$/gm, ""), setvalid);
    }
  }, [delayedInput]);
  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input
            value={input}
            onChange={onChange}
            name="username"
            placeholder="myname"
          />
          <button type="submit" className="btn-green">
            Submit
          </button>
          <h3>Debug State</h3>
          <div>
            Username: {input}
            <br />
            Username Valid: {valid.toLocaleString()}
          </div>
        </form>
      </section>
    )
  );
}
export function SignOutButton() {
  return (
    <Link href={"/enter"}>
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
function SignInButton() {
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <button onClick={signInWithGoogle} className="btn-google">
        <img src={"/logo.png"} width="30px" /> Sign in with Google
      </button>
      <button>Sign in Anonymously</button>
    </>
  );
}
async function checkusername(username, setvalid) {
  const docRef = doc(fsDB, "usernames", username);
  const docSnap = await getDoc(docRef);
  let NEWdata = docSnap.exists();
  if (username.length < 3) {
    setvalid(false);
  } else if (username.length >= 3) {
    setvalid(!NEWdata);
  }
}
