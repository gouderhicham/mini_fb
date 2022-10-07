import {
  collectionGroup,
  query,
  getDocs,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { fsDB } from "../lib/firebase";
import { useState } from "react";
import Posts from "../components/Posts";
import Loader from "../components/Loader";
import Head from "next/head";
export default function Home({ posts }) {
  const [stateposts, setstateposts] = useState(posts);
  const [loading, setloading] = useState(false);
  const [postend, setpostend] = useState(false);
  async function getMorePosts() {
    setloading(true);
    let newPOSTS = [];
    const last = stateposts[stateposts.length - 1]?.createdAt;
    const ref = collectionGroup(fsDB, "posts");
    const q = query(
      ref,
      orderBy("createdAt", "desc"),
      startAfter(last),
      where("published", "==", true),
      limit(5)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setstateposts((oldposts) => [...oldposts, doc.data()]);
      setloading(false);
    });
    if (newPOSTS.length === 0) {
      setpostend(true);
      setloading(false);
    }
  }
  return (
    <>
      <Head>
        <title>Mini Fb | Gouder hicham</title>
        <meta name="robots" content="gouder hicham mini fb page"></meta>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="this is the index page"></meta>
        <meta name="author" content="gouder hicham"></meta>
        <meta property="og:type" content="website" />
        <meta property="og:url" content={"home page"} />
        <meta property="og:title" content="home page mini fb github" />
        <meta property="og:description" content="home page github mini fb" />
        <meta property="og:image" />
        <meta
          name="keywords"
          content="gouder hicham , gouder , hicham , gouderhicham github , mini gb"
        />
      </Head>
      <main>
        <Posts posts={stateposts} />
        {!loading && <button onClick={getMorePosts}>Load more</button>}
        <Loader show={loading} />
      </main>
    </>
  );
}
export async function getServerSideProps() {
  let posts = [];
  // NOTE: get all the posts from all users
  const ref = collectionGroup(fsDB, "posts");
  const q = query(
    ref,
    orderBy("createdAt", "desc"),
    where("published", "==", true),
    limit(5)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    posts.push(doc.data());
  });
  return {
    props: {
      posts: posts,
    },
  };
}
