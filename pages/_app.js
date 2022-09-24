import Head from "next/head";
import "../styles/global.css";
import Nav from "../components/Nav";
import { Toaster } from "react-hot-toast";
import ContextNext from "../lib/ContextNext";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Next app</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="this is the index page"></meta>
      </Head>
      <ContextNext>
        <Nav />
        <Component {...pageProps} />
        <Toaster />
      </ContextNext>
    </>
  );
}
export default MyApp;
