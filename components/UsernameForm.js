import { setDoc, doc} from "firebase/firestore";
import { useState, useEffect } from "react";
import Image from "next/image";
import Loader from "../components/Loader";
import useDebounce from "@clave/use-debounce";
import { checkusername } from "../lib/hooks";
import { fsDB } from "../lib/firebase";
export default function UsernameForm({ user, username, setsubmitclicked }) {
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
    setvalid(false)
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
            disabled={!valid}
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
