import { auth, googleAuthProvider } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useContext, useEffect } from "react";
import { AppContext } from "../lib/ContextNext";
import  UsernameForm  from "../components/UsernameForm";
const SignIn = () => {
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
          <h1>{profileuser.username} logged in</h1>
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
};
export default SignIn;

function SignInButton() {
  const signInWithGoogle = async () => {
    signInWithPopup(auth, googleAuthProvider).catch((err) => console.log(err));
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
