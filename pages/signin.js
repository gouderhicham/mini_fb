import { auth, googleAuthProvider } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useContext, useEffect } from "react";
import { AppContext } from "../lib/ContextNext";
import UsernameForm from "../components/UsernameForm";
import Head from "next/head";
import { return_url } from "../lib/hooks";
const SignIn = ({ image }) => {
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
        <meta name="robots" content="gouder hicham mini fb page"></meta>
        <meta
          name="keywords"
          content="gouder hicham , gouder , hicham , gouderhicham github , mini gb"
        />
        <meta name="author" content="gouder hicham"></meta>

        <meta property="og:type" content="website" />
        <meta property="og:url" content={"sign in page"} />
        <meta property="og:title" content="Sign in Page | Mini Fb" />
        <meta property="og:image" content={image} />
        <meta
          property="og:description"
          content="sign in page that redirect you to the user page after you login with you google account"
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
export async function getServerSideProps(context) {
  const params = context.resolvedUrl;
  const base = return_url(context);
  const url = `${base}${params}`;
  const image = await fetch(
    `https://api.savepage.io/v1/?key=96d39481fc5e144daf42d4b3d03fccee&q=${url}`
  ).then((res) => res.url);
  return {
    props: {
      image: image,
    },
  };
}