import dynamic from "next/dynamic";
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
const Posts = dynamic(() => import("../components/Posts"), {
  loading: () => <div>...loading</div>,
});
const Loader = dynamic(() => import("../components/Loader"), {
  loading: () => <div>...loading</div>,
});
import Head from "next/head";

const POSTS_PER_PAGE = 5; // Limit the initial number of posts to be loaded

export default function Home({ posts, image }) {
  const [stateposts, setstateposts] = useState(posts); // Load only the initial number of posts
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
      limit(5) // Load more posts per click
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      newPOSTS.push(doc.data());
    });
    if (newPOSTS.length > 0) {
      setstateposts((oldposts) => [...oldposts, ...newPOSTS]);
    } else {
      setpostend(true);
    }
    setloading(false);
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
        <meta property="og:title" content="Mini Fb | Gouder hicham" />
        <meta
          property="og:description"
          content="Mini fb Home page created with next js that is generated with the power of electrecity"
        />
        <meta property="og:image" content={image} />
        <meta
          name="keywords"
          content="gouder hicham , gouder , hicham , gouderhicham github , mini gb"
        />
      </Head>
      <main>
        <Posts posts={stateposts} />
        {!postend && (
          <button onClick={getMorePosts}>
            {loading ? "Loading..." : "Load more"}
          </button>
        )}
        <Loader show={loading} />
      </main>
    </>
  );
}

export async function getStaticProps() {
  const ref = collectionGroup(fsDB, "posts");
  const q = query(
    ref,
    limit(5),
    where("published", "==", true),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  const posts = querySnapshot.docs.map((doc) => doc.data());
  const params = "";
  const base = "";
  const url = `${base}${params}`;
  const image = await fetch(
    `https://api.savepage.io/v1/?key=96d39481fc5e144daf42d4b3d03fccee&q=${url}`
  ).then((res) => res.url);

  return {
    props: {
      image,
      posts,
    },
    revalidate: 60,
  };
}