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
      limit(1)
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
    limit(1)
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
