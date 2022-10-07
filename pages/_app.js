import "../styles/global.css";
import Nav from "../components/Nav";
import { Toaster } from "react-hot-toast";
import ContextNext from "../lib/ContextNext";
import NextNProgress from "nextjs-progressbar";

function MyApp({ Component, pageProps }) {
  return (
    <>
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
