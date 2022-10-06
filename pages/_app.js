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
        <title>Gouder hicham mini fb</title>
        <meta name="robots" content="gouder hicham mini fb page"></meta>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="this is the index page"></meta>
        <meta name="author" content="gouder hicham"></meta>
        <meta property="og:type" content="website" />
        <meta property="og:url" content={"home page"} />
        <meta property="og:title" content="home page mini fb github" />
        <meta property="og:description" content="home page github mini fb" />
        <meta name="keywords" content="gouder hicham , gouder , hicham , gouderhicham github , mini gb"/>

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
