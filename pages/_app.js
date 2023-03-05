import Nav from "../components/Nav";
import { Toaster } from "react-hot-toast";
import ContextNext from "../lib/ContextNext";
import NextNProgress from "nextjs-progressbar";
import "../styles/global.css";
function MyApp({ Component, pageProps }) {
  return (
    <>
      <ContextNext>
        <Nav />
        <Toaster />
        <NextNProgress options={{ showSpinner: false }} />
        <Component {...pageProps} />
      </ContextNext>
    </>
  );
}
export default MyApp;