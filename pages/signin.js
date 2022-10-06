import { auth, googleAuthProvider } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useContext, useEffect } from "react";
import { AppContext } from "../lib/ContextNext";
import UsernameForm from "../components/UsernameForm";
import Head from "next/head";
const SignIn = () => {
  const { user, profileuser, setsubmitclicked } = useContext(AppContext);
  useEffect(() => {
    setsubmitclicked(false);
  }, []);
  return (
    <>
      <Head>
        <title>Mini Fb Sign in Page | Gouderhicham</title>
        <meta
          name="description"
          content="Mini fb sign in page to link a google user account"
        ></meta>
        <meta name="keywords" content="gouder hicham , gouder , hicham , gouderhicham github , mini gb"/>
        <meta name="author" content="gouder hicham"></meta>

        <meta property="og:type" content="website" />
        <meta property="og:url" content={"sign in page"} />
        <meta property="og:title" content="sign in page haha" />
        <meta
          property="og:description"
          content = "sign in page that redirect you to the user page"
        />
      </Head>
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
    </>
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
