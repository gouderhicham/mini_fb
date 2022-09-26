import Head from "next/head";
import "../styles/global.css";
import Nav from "../components/Nav";
import { Toaster } from "react-hot-toast";
import ContextNext from "../lib/ContextNext";
import NextNProgress from "nextjs-progressbar";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Next app</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="this is the index page"></meta>
      </Head>
      <NextNProgress options={{ showSpinner: false }} />

      <ContextNext>
        <Nav />
        <Component {...pageProps} />
        <Toaster />
      </ContextNext>
    </>
  );
}
export default MyApp;
