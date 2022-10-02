import { auth, googleAuthProvider, fsDB } from "../lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../lib/ContextNext";
import useDebounce from "@clave/use-debounce";
import Link from "next/link";
import { setDoc, doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import Loader from "../components/Loader";
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
  const [loading, setloading] = useState(false);
  const [input, setinput] = useState("");
  const [valid, setvalid] = useState(false);
  const onChange = (e) => {
    let value = e.target.value.toLowerCase();
    setinput(value);
    setinput(value.toLowerCase());
  };
  async function onSubmit(e) {
    e.preventDefault();
    if (loading) return;
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
      checkusername(
        delayedInput.replace(/^\s+|\s+$/gm, ""),
        setvalid,
        setloading
      );
    }
  }, [delayedInput]);
  useEffect(() => {
    setloading(true);
  }, [input]);
  return (
    !username && (
      <section style={{ padding: "2rem" }} className="sign-in-form">
        <h2>Choose Username</h2>
        <form className="align-center" onSubmit={onSubmit}>
          <input
            autoComplete={"off"}
            value={input}
            onChange={onChange}
            name="username"
            placeholder="myname"
          />
          <button
            disabled={loading ? true : false}
            type="submit"
            className="btn-green"
          >
            Submit
          </button>
          <div className="align-center-row">
            <Image src="/validation.png" width={30} height={30} />
            <h4 style={{ paddingLeft: 5 }}>validation</h4>
          </div>
          <Loader show={loading} />

          <div>Username Valid: {valid.toLocaleString()}</div>
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
      signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="sign-in-form">
      <button onClick={signInWithGoogle} className="btn-google">
        <img src={"/logo.png"} /> Sign in with Google
      </button>
      <button className="btn-blue">Sign in width email</button>
    </div>
  );
}
async function checkusername(username, setvalid, setloading) {
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
